// backend/routes/authRoute.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);

// If you have a register route
router.post('/register', authController.register);

module.exports = router;
