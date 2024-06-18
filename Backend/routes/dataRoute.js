// backend/routes/dataRoute.js
const express = require('express');
const { distributeData, getDataCounts, getAssignedData, getDataById, updateData, orderData, cancelData, callbackData, getOrderedDataById, getCancelDataById, getCallbackDataById  } = require('../controllers/dataController');

const router = express.Router();

router.post('/distribute', distributeData);
router.get('/counts', getDataCounts);
router.get('/assigned/:employeeId', getAssignedData);
router.get('/:id', getDataById);
router.put('/:id', updateData);
router.post('/:id/order', orderData);
router.post('/:id/cancel', cancelData);
router.post('/:id/callback', callbackData);
router.get('/orders/:employeeId', getOrderedDataById);
router.get('/canceled/:employeeId', getCancelDataById);
router.get('/callbacks/:employeeId', getCallbackDataById);



module.exports = router;