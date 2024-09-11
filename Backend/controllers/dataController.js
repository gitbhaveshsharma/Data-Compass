const cron = require('node-cron');
const mongoose = require('mongoose');
const Data = require('../models/Data');
const Order = require('../models/Order');
const Cancel = require('../models/Cancel');
const Callback = require('../models/Callback');
const User = require('../models/User');

const distributeData = async (req, res) => {
    const { employeeIds, dataCount, departments } = req.body;

    try {
        const updates = [];
        const assignmentMessages = [];

        for (let i = 0; i < employeeIds.length; i++) {
            const { _id, employeeId } = employeeIds[i]; // Destructure _id and employeeId
            const department = departments[i];

            let unassignedData;

            if (department === 'verify') {
                unassignedData = await Order.find({ status: 'pending', assignedTo: { $ne: _id } }).limit(dataCount * employeeIds.length);
            } else if (department === 'flead') {
                unassignedData = await Data.find({ status: 'unassigned' }).limit(dataCount * employeeIds.length);
            }

            if (unassignedData && unassignedData.length > 0) {
                const assignedData = unassignedData.slice(i * dataCount, (i + 1) * dataCount);
                assignedData.forEach(data => {
                    data.assignedTo = _id; // Assign _id to assignedTo
                    data.employeeId = employeeId; // Assign employeeId to employeeId field
                    if (department === 'flead') {
                        data.status = 'assigned';
                    } else if (department === 'verify') {
                        data.status = 'under verification';
                    }
                    updates.push(data.save());
                });
                assignmentMessages.push(`Assigned ${assignedData.length} items to employee ${employeeId} in ${department} department.`);
            }
        }

        await Promise.all(updates);

        res.status(200).json({ message: 'Data distributed successfully', assignmentMessages });
    } catch (error) {
        res.status(500).json({ message: 'Error distributing data', error });
    }
};

// Fetch data counts
const getDataCounts = async (req, res) => {
    try {
        const assignedCount = await Data.countDocuments({ status: 'assigned' });
        const unassignedCount = await Data.countDocuments({ status: 'unassigned' });
        res.status(200).json({ assignedCount, unassignedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data counts' });
    }
};

const autoAssignOrders = async () => {
    try {
        // Fetch eligible employees from the verify department
        const employees = await User.find({
            department: 'verify',
            status: { $in: ['active', 'online', 'offline'] }
        }).sort({ _id: 1 });

        if (employees.length === 0) {
            // console.log('No eligible employees found in the verify department.');
            return;
        }

        // Fetch pending orders
        const pendingOrders = await Order.find({ status: 'pending' }).sort({ createdAt: 1 });

        if (pendingOrders.length === 0) {
            // console.log('No pending orders to assign.');
            return;
        }

        // Check if the number of pending orders meets the threshold
        const threshold = 5;
        if (pendingOrders.length < threshold) {
            // console.log(`Pending orders (${pendingOrders.length}) have not reached the threshold (${threshold}).`);
            return;
        }

        // Distribute orders to employees in a round-robin fashion
        let assignedCount = 0;
        let employeeIndex = employees.findIndex(emp => !emp.assigned) || 0;

        for (const order of pendingOrders) {
            const employee = employees[employeeIndex];
            order.assignedTo = employee._id;
            order.employeeId = employee.employeeId;
            order.status = 'under verification';
            await order.save();

            employee.assigned = true;
            await employee.save();

            assignedCount++;
            employeeIndex = (employeeIndex + 1) % employees.length;

            // Reset assignment flags if last employee received an order
            if (employeeIndex === 0) {
                employees.forEach(emp => emp.assigned = false);
                await Promise.all(employees.map(emp => emp.save()));
            }
        }

        // console.log(`${assignedCount} orders have been distributed to employees.`);
    } catch (error) {
        console.error('Error in auto-assign orders:', error);
    }
};

const autoAssignOrdersForRto = async () => {
    try {
        // Fetch eligible employees from the rto department
        const employees = await User.find({
            department: 'rto',
            status: { $in: ['active', 'online', 'offline'] }
        }).sort({ _id: 1 });

        if (employees.length === 0) {
            return;
        }

        // Fetch orders with return order status
        const returnOrders = await Order.find({ status: 'returned' }).sort({ createdAt: 1 });

        if (returnOrders.length === 0) {
            return;
        }

        // Distribute orders to employees in a round-robin fashion
        let employeeIndex = employees.findIndex(emp => !emp.assigned) || 0;

        for (const order of returnOrders) {
            const employee = employees[employeeIndex];
            order.assignedTo = employee._id;
            order.employeeId = employee.employeeId;
            order.status = 'under rto';
            await order.save();

            employee.assigned = true;
            await employee.save();

            employeeIndex = (employeeIndex + 1) % employees.length;

            // Reset assignment flags if last employee received an order
            if (employeeIndex === 0) {
                employees.forEach(emp => emp.assigned = false);
                await Promise.all(employees.map(emp => emp.save()));
            }
        }
        // console.log(`return items have been distributed to RTO employees.`);
    } catch (error) {
        console.error('Error in auto-assign orders for RTO:', error);
    }
};

const autoAssignOrdersForRework = async () => {
    try {
        // Fetch eligible employees from the rework department
        const employees = await User.find({
            department: 'rework',
            status: { $in: ['active', 'online', 'offline'] }
        }).sort({ _id: 1 });

        if (employees.length === 0) {
            return;
        }

        // Fetch orders with canceled status from the Order model
        const canceledOrders = await Order.find({ status: 'canceled' }).sort({ createdAt: 1 });

        // Fetch records with canceled status from the Data model
        const canceledData = await Data.find({ status: 'canceled' }).sort({ createdAt: 1 });

        // Combine the results from both models
        const canceledItems = [...canceledOrders, ...canceledData];

        if (canceledItems.length === 0) {
            return;
        }

        // Distribute orders to employees in a round-robin fashion
        let employeeIndex = employees.findIndex(emp => !emp.assigned) || 0;

        for (const item of canceledItems) {
            const employee = employees[employeeIndex];

            // Assign the item to the employee
            item.assignedTo = employee._id;
            item.employeeId = employee.employeeId;
            item.status = 'under rework';
            await item.save();

            employee.assigned = true;
            await employee.save();

            employeeIndex = (employeeIndex + 1) % employees.length;

            // Reset assignment flags if last employee received an order
            if (employeeIndex === 0) {
                employees.forEach(emp => emp.assigned = false);
                await Promise.all(employees.map(emp => emp.save()));
            }
        }

        // console.log(`${canceledItems.length} canceled items have been distributed to Rework employees.`);
    } catch (error) {
        console.error('Error in auto-assign canceled items to Rework:', error);
    }
};

// Schedule the tasks to run every 3:00AM minutes
cron.schedule('*/2 * * * *', autoAssignOrders);
cron.schedule('0 3 * * *', autoAssignOrdersForRto);
cron.schedule('0 3 * * *', autoAssignOrdersForRework);


// Fetch data assigned to a specific employee
const getAssignedData = async (req, res) => {
    const { employeeId } = req.params;
    try {
        let assignedData;
        if (employeeId === 'all') {
            assignedData = await Data.find({});
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            assignedData = await Data.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        }
        res.json(assignedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assigned data' });
    }
};



const updateDataStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(req.id)
        console.log(req.body)
        const data = await Data.findByIdAndUpdate(id, {status}, { new: true });
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


// Fetch data by ID
const getDataById = async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch order data by ID
const getOrderDataById = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ message: error.message });
    }
};

// Fetch cancel data by ID
const getCancelDataById = async (req, res) => {
    try {
        const data = await Cancel.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching cancel data:', error);
        res.status(500).json({ message: error.message });
    }
};

// Fetch callback data by ID
const getCallbackDataById = async (req, res) => {
    try {
        const data = await Data.findOne({ _id: req.params.id, status: 'callback' });
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching callback data:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update data
const updateData = async (req, res) => {
    try {
        const { name, number, address, city, state, zip, nearBy, area, altNumber, assignedTo } = req.body;
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { name, number, address, city, state, zip, nearBy, area, altNumber, assignedTo },
            { new: true }
        );
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: error.message });
    }
};

const orderData = async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const { products, status, billDetails } = req.body;

        const orderId = await Order.generateOrderId();

        // Calculate expected delivery date (e.g., 7 days from now)
        const expectedDeliveryDate = new Date();
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

        const order = new Order({
            dataId: data._id,
            name: data.name,
            number: data.number,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            nearBy: data.nearBy,
            area: data.area,
            altNumber: data.altNumber,
            assignedTo: data.assignedTo,
            customerId: data.customerId,
            products,
            billDetails: billDetails || [],  // Ensure billDetails is an array
            status,
            orderId,
            expectedDeliveryDate, // Set the expected delivery date
        });

        await order.save();
        data.status = 'order';
        await data.save();
        res.json(order);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};



// Fetch all order data for admin or specific employee
const getOrderedData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        let orderedData;
        if (employeeId === 'all') {
            orderedData = await Order.find({});
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            orderedData = await Order.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        }
        res.json(orderedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order data' });
    }
};

// Mark data as canceled
const cancelData = async (req, res) => {
    try {
        // Determine the department from request (assuming req.body or req.query contains this information)
        const department = req.body.department || req.query.department;

        let data;

        // Fetch the data based on the department
        if (department === 'flead') {
            data = await Data.findById(req.params.id);
        } else if (department === 'verify' || department === 'logistics') {
            data = await Order.findById(req.params.id);
        } else {
            return res.status(400).json({ message: 'Invalid department' });
        }

        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // Create a new Cancel document
        const cancel = new Cancel({
            dataId: data._id,
            name: data.name,
            number: data.number,
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            nearBy: data.nearBy || '',
            area: data.area || '',
            altNumber: data.altNumber || '',
            products: data.products || [], // Use data.products if it exists
            billDetails: data.billDetails || [], // Use data.billDetails if it exists
            status: 'canceled', // Ensure status is 'canceled'
            assignedTo: data.assignedTo,
            orderId: data.orderId || '', // Use data.orderId if it exists
            customerId: data.customerId || '',
            employeeId: data.employeeId || null,
            expectedDeliveryDate: data.expectedDeliveryDate || null,
            department: department, // Set the department field
        });

        await cancel.save();

        // Update the original data's status
        data.status = 'canceled';
        await data.save();

        res.json(cancel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fetch all canceled data for admin or specific employee
const getCanceledData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        let canceledData;
        if (employeeId === 'all') {
            canceledData = await Cancel.find({});
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            canceledData = await Cancel.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        }
        res.json(canceledData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch canceled data' });
    }
};

// Fetch all callback data for admin or specific employee
const getCallbackData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        let callbackData;
        if (employeeId === 'all') {
            callbackData = await Data.find({ status: 'callback' });
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            callbackData = await Data.find({
                status: 'callback',
                assignedTo: new mongoose.Types.ObjectId(employeeId)
            });
        }
        res.json(callbackData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch callback data' });
    }
};



const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteProductFromOrder = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const order = await Order.findById(id);
        order.products.id(productId).deleteOne();
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const order = await Order.findByIdAndUpdate(id, update, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getVerifyStatusOrders = async (req, res) => {
    try {
        const verifyStatusOrders = await Order.find({ status: 'verified' });
        res.json(verifyStatusOrders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch verify status orders' });
    }
};

const getHoldData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        let callbackData;
        if (employeeId === 'all') {
            callbackData = await Data.find({ status: 'Hold' });
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            callbackData = await Data.find({
                status: 'Hold',
                assignedTo: new mongoose.Types.ObjectId(employeeId)
            });
        }
        res.json(callbackData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Hold data' });
    }
};

const getHoldDataById = async (req, res) => {
    try {
        const data = await Data.findOne({ _id: req.params.id, status: 'Hold' });
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching Hold data:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    distributeData,
    getDataCounts,
    getAssignedData,
    getDataById,
    updateData,
    orderData,
    cancelData,
    getOrderedData,
    getCanceledData,
    getCallbackData,
    getOrderDataById,
    getCancelDataById,
    getCallbackDataById,
    updateOrderStatus,
    updateDataStatus,
    deleteProductFromOrder,
    updateOrder,
    getVerifyStatusOrders,
    getHoldData,
    getHoldDataById,
};
