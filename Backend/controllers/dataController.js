const mongoose = require('mongoose');
const Data = require('../models/Data');
const Order = require('../models/Order');
const Cancel = require('../models/Cancel');
const Callback = require('../models/Callback');

// Distribute data to employees
const distributeData = async (req, res) => {
    const { employeeIds, dataCount } = req.body;

    try {
        const unassignedData = await Data.find({ status: 'unassigned' }).limit(dataCount * employeeIds.length);

        const updates = [];
        employeeIds.forEach((employeeId, index) => {
            const assignedData = unassignedData.slice(index * dataCount, (index + 1) * dataCount);
            assignedData.forEach(data => {
                data.status = 'assigned';
                data.assignedTo = employeeId;
                updates.push(data.save());
            });
        });

        await Promise.all(updates);

        const updatedData = await Data.find({});

        res.status(200).json({ updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Error distributing data' });
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
        console.log(`Received request to fetch data for employee ID: ${employeeId}`);
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            console.log('Invalid employee ID');
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        const assignedData = await Data.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        console.log(`Found ${assignedData.length} records for employee ID: ${employeeId}`);
        res.json(assignedData);
    } catch (error) {
        console.error(`Failed to fetch assigned data for employee ID: ${employeeId}`, error);
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

// Update data
const updateData = async (req, res) => {
    try {
        const { name, number, address } = req.body;
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { name, number, address },
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

// Mark data as ordered
const orderData = async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const order = new Order({
            dataId: data._id,
            name: data.name,
            number: data.number,
            address: data.address,
            assignedTo: data.assignedTo,
        });
        await order.save();
        data.status = 'order';
        await data.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// fatch order data to a specific employee
const getOrderedDataById = async (req, res) => {
    const { employeeId } = req.params;
    try {
        console.log(`Received request to fetch order data for employee ID: ${employeeId}`);
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            console.log('Invalid employee ID');
            return res.status(400).json({ error: 'Invalid employee ID' });
        }
        const orderedData = await Order.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        console.log(`Found ${orderedData.length} records for employee ID: ${employeeId}`);
        res.json(orderedData);
    } catch (error) {
        console.error(`Failed to fetch order data for employee ID: ${employeeId}`, error);
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

// fatch cancel data to a specific employee

const getCancelDataById = async (req, res) => {
    const { employeeId } = req.params;
    try {
        console.log(`Received request to fetch Cancel data for employee ID: ${employeeId}`);
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            console.log('Invalid employee ID');
            return res.status(400).json({ error: 'Invalid employee ID' });
        }
        const canceledData = await Cancel.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        console.log(`Found ${canceledData.length} records for employee ID: ${employeeId}`);
        res.json(canceledData);
    } catch (error) {
        console.error(`Failed to fetch Cancel data for employee ID: ${employeeId}`, error);
        res.status(500).json({ error: 'Failed to fetch Cancel data' });
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

// fatch callback data to a specific emplyee
const getCallbackDataById = async (req, res) => {
    const { employeeId } = req.params;
    try {
        console.log(`Received request to fetch Callback data for employee ID: ${employeeId}`);
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            console.log('Invalid employee ID');
            return res.status(400).json({ error: 'Invalid employee ID' });
        }
        const callbackData = await Callback.find({ assignedTo: new mongoose.Types.ObjectId(employeeId) });
        console.log(`Found ${callbackData.length} records for employee ID: ${employeeId}`);
        res.json(callbackData);
    } catch (error) {
        console.error(`Failed to fetch Callback data for employee ID: ${employeeId}`, error);
        res.status(500).json({ error: 'Failed to fetch Callback data' });
    }
};




module.exports = { distributeData, getDataCounts, getAssignedData, updateDataStatus, getDataById, updateData, orderData, callbackData, cancelData, getOrderedDataById, getCancelDataById, getCallbackDataById };
