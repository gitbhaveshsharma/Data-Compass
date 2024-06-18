// backend/routes/authRoute.js
const express = require('express');
const { loginUser, getUserData } = require('../controllers/authController');


const router = express.Router();

router.post('/login', loginUser);
router.get('/user', getUserData);

module.exports = router;
