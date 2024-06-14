// backend/controllers/employeeController.js
const User = require('../models/User');

const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee', department: 'Flead' });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
};

module.exports = { getEmployees };
