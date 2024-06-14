// backend/routes/dataRoute.js
const express = require('express');
const { distributeData } = require('../controllers/dataController');

const router = express.Router();

router.post('/distribute', distributeData);

module.exports = router;
