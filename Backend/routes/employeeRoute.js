// backend/routes/employeeRoute.js
const express = require('express');
const { getEmployees, updateEmployee, getEmployeeByEmail } = require('../controllers/employeeController');

const router = express.Router();

router.get('/', getEmployees);
router.get('/email', getEmployeeByEmail);

// Route to update employee by ID
router.put('/:id', updateEmployee);

module.exports = router;
