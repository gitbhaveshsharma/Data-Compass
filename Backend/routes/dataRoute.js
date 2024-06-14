// backend/routes/dataRoute.js
const express = require('express');
const { distributeData, getDataCounts } = require('../controllers/dataController');

const router = express.Router();

router.post('/distribute', distributeData);
router.get('/counts', getDataCounts);

module.exports = router;