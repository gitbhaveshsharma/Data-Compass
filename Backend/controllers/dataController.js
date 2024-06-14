// backend/controllers/dataController.js
const Data = require('../models/Data');

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

const getDataCounts = async (req, res) => {
    try {
        const assignedCount = await Data.countDocuments({ status: 'assigned' });
        const unassignedCount = await Data.countDocuments({ status: 'unassigned' });
        res.status(200).json({ assignedCount, unassignedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data counts' });
    }
};

module.exports = { distributeData, getDataCounts };
