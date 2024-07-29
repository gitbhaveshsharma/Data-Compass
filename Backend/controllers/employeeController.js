// backend/controllers/employeeController.js
const User = require('../models/User');

const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
};

const getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    // console.log('Received email:', email); // Log received email

      const employee = await User.findOne({ email: email.trim() });
    // console.log('Queried employee:', employee); // Log result from database

    if (!employee) {
    //   console.log('Employee not found');
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    // console.error('Error querying employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
      const { name, email, password, department, employeeId, status } = req.body;
      console.log("req form formtend", req.body )
        const employee = await User.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.department = department || employee.department;
        employee.employeeId = employeeId || employee.employeeId;
        employee.status = status || employee.status;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(password, salt);
        }

        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee details' });
    }
};

module.exports = {
    getEmployees,
    getEmployeeByEmail,
    updateEmployee,
};