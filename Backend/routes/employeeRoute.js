// backend/routes/employeeRoute.js
const express = require('express');
const { getEmployees, updateEmployee, getEmployeeByEmployeeId } = require('../controllers/employeeController');

const router = express.Router();

router.get('/', getEmployees);
router.get('/employeeId', getEmployeeByEmployeeId);

// Route to update employee by ID
router.put('/:id', updateEmployee);

module.exports = router;
