// backend/controllers/employeeController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password -_v');

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

const getEmployeeByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.query;

    // Find employee by employeeId but exclude password and other sensitive fields
    const employee = await User.findOne({ employeeId: employeeId.trim() }).select('-password -_v -sensitiveField2');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, department, employeeId, status } = req.body;

    // Find the employee by ID
    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.employeeId = employeeId || employee.employeeId;
    employee.status = status || employee.status;

    // Only set the password if a new password is provided (do not hash it here)
    if (password) {
      employee.password = password; // Assign the plain password directly
    }

    // Save the updated employee; Mongoose middleware will hash the password
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    // console.error('Error updating employee details:', error);
    res.status(500).json({ message: 'Error updating employee details' });
  }
};

module.exports = {
    getEmployees,
    getEmployeeByEmployeeId,
    updateEmployee,
};