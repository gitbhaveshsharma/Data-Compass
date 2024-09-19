const IP = require('../models/Ip');
const Employee = require('../models/User');

// Check if user is in the IT department
function isITDepartment(req) {
    return req.user.department === 'IT';
}

// Register a new IP address
const registerIP = async (req, res) => {
    if (!isITDepartment(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { ip, name } = req.body;

    try {
        const newIP = new IP({ ip, name });
        await newIP.save();
        res.status(201).json(newIP);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an existing IP address
const updateIP = async (req, res) => {
    if (!isITDepartment(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { ip } = req.params;
    const { name, status } = req.body;

    try {
        const updatedIP = await IP.findOneAndUpdate({ ip }, { name, status }, { new: true });
        if (!updatedIP) {
            return res.status(404).json({ message: 'IP not found' });
        }
        res.status(200).json(updatedIP);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an IP address
const deleteIP = async (req, res) => {

    if (!isITDepartment(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { ip } = req.params;

    try {
        const deletedIP = await IP.findOneAndDelete({ ip });
        if (!deletedIP) {
            return res.status(404).json({ message: 'IP not found' });
        }
        res.status(200).json({ message: 'IP deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update the status of an IP address
const updateStatus = async (req, res) => {
    console.log("a:", req.body)
    if (!isITDepartment(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { ip } = req.params;
    const { status } = req.body;

    try {
        const updatedIP = await IP.findOneAndUpdate({ ip }, { status }, { new: true });
        if (!updatedIP) {
            return res.status(404).json({ message: 'IP not found' });
        }
        res.status(200).json(updatedIP);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all IPs
const getIP = async (req, res) => {
    if (!isITDepartment(req)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const ips = await IP.find();
        res.status(200).json(ips);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    registerIP,
    updateIP,
    deleteIP,
    updateStatus,
    getIP
};
