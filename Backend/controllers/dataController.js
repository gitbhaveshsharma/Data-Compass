const mongoose = require('mongoose');
const Data = require('../models/Data');
const Order = require('../models/Order');
const Cancel = require('../models/Cancel');
const Callback = require('../models/Callback');

const distributeData = async (req, res) => {
    const { employeeIds, dataCount, departments } = req.body;

    try {
        const updates = [];
        const assignmentMessages = [];

        for (let i = 0; i < employeeIds.length; i++) {
            const employeeId = employeeIds[i];
            const department = departments[i];

            let unassignedData;

            if (department === 'Verify') {
                unassignedData = await Order.find({ status: 'pending', assignedTo: { $ne: employeeId } }).limit(dataCount * employeeIds.length);
            } else if (department === 'flead') {
                unassignedData = await Data.find({ status: 'unassigned' }).limit(dataCount * employeeIds.length);
            }

            if (unassignedData && unassignedData.length > 0) {
                const assignedData = unassignedData.slice(i * dataCount, (i + 1) * dataCount);
                assignedData.forEach(data => {
                    data.assignedTo = employeeId;
                    if (department === 'flead') {
                        data.status = 'assigned';
                    } else if (department === 'Verify') {
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

// Update data status and assignedTo field
const updateDataStatus = async (req, res) => {
    const { dataId, status, assignedTo } = req.body;

    try {
        const updatedData = await Data.findByIdAndUpdate(
            dataId,
            { status, assignedTo: new mongoose.Types.ObjectId(assignedTo) },
            { new: true }
        );
        res.json(updatedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
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
            console.log(`Order data not found with ID: ${req.params.id}`);
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
            console.log(`Cancel data not found with ID: ${req.params.id}`);
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
        const data = await Callback.findById(req.params.id);
        if (!data) {
            console.log(`Callback data not found with ID: ${req.params.id}`);
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
            orderId
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
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const cancel = new Cancel({
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
        });
        await cancel.save();
        data.status = 'cancel';
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

// Mark data for callback
const callbackData = async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const callback = new Callback({
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
        });
        await callback.save();
        data.status = 'callback';
        await data.save();
        res.json(callback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all callback data for admin or specific employee
const getCallbackData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        let callbackData;
        if (employeeId === 'all') {
            callbackData = await Callback.find({});
        } else {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ error: 'Invalid employee ID' });
            }
            callbackData = await Callback.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
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

module.exports = {
    distributeData,
    getDataCounts,
    getAssignedData,
    updateDataStatus,
    getDataById,
    updateData,
    orderData,
    callbackData,
    cancelData,
    getOrderedData,
    getCanceledData,
    getCallbackData,
    getOrderDataById,
    getCancelDataById,
    getCallbackDataById,
    updateOrderStatus,
    deleteProductFromOrder,
    updateOrder,
    getVerifyStatusOrders,
};
