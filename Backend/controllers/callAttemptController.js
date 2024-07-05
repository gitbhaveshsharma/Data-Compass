// controllers/callAttemptController.js
const CallAttempt = require('../models/CallAttempt');

// Get all call attempts
exports.getCallAttempts = async (req, res) => {
    try {
        const callAttempts = await CallAttempt.find();
        res.json(callAttempts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific call attempt by ID
exports.getCallAttemptById = async (req, res) => {
    try {
        const callAttempt = await CallAttempt.findById(req.params.id);
        if (!callAttempt) {
            return res.status(404).json({ message: 'Call attempt not found' });
        }
        res.json(callAttempt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Create a new call attempt
exports.createCallAttempt = async (req, res) => {
    const { attemptsNumber, callStatus, callDescription, departmentLevel, number, message, dataId } = req.body;

    try {
        // Check for duplicate attempt number at the same department level and data ID
        const duplicateAttempt = await CallAttempt.findOne({
            attemptsNumber,
            departmentLevel,
            dataId
        });

        if (duplicateAttempt) {
            return res.status(400).json({ message: 'Duplicate attempt number at the same department level with the same data ID' });
        }

        const callAttempt = new CallAttempt({
            attemptsNumber,
            callStatus,
            callDescription,
            departmentLevel,
            number,
            message,
            dataId
        });

        const newCallAttempt = await callAttempt.save();
        res.status(201).json(newCallAttempt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a call attempt
exports.updateCallAttempt = async (req, res) => {
    try {
        const updatedCallAttempt = await CallAttempt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCallAttempt) {
            return res.status(404).json({ message: 'Call attempt not found' });
        }
        res.json(updatedCallAttempt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a call attempt
exports.deleteCallAttempt = async (req, res) => {
    try {
        const callAttempt = await CallAttempt.findByIdAndDelete(req.params.id);
        if (!callAttempt) {
            return res.status(404).json({ message: 'Call attempt not found' });
        }
        res.json({ message: 'Call attempt deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get call attempts by dataId
exports.getCallAttemptsByDataId = async (req, res) => {
    try {
        const { dataId } = req.params;
        const callAttempts = await CallAttempt.find({ dataId });
        if (!callAttempts) {
            return res.status(404).json({ message: 'No call attempts found for this dataId' });
        }
        res.status(200).json(callAttempts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

