// backend/routes/employeeRoute.js
const express = require('express');
const { getEmployees } = require('../controllers/employeeController');

const router = express.Router();

router.get('/', getEmployees);

module.exports = router;
