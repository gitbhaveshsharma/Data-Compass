const express = require('express');
const {
    distributeData,
    getDataCounts,
    getAssignedData,
    getDataById,
    updateData,
    orderData,
    cancelData,
    getOrderedData,
    getCanceledData,
    getCallbackData,
    getOrderDataById,
    getCancelDataById,
    getCallbackDataById,
    updateOrderStatus,
    deleteProductFromOrder,
    updateOrder,
    getVerifyStatusOrders,
    updateDataHoldStatus,
    updateDataCallbackStatus,
    getHoldData,
    getHoldDataById
} = require('../controllers/dataController');

const router = express.Router();

router.post('/distribute', distributeData);
router.get('/counts', getDataCounts);
router.get('/assigned/:employeeId', getAssignedData);
router.get('/:id', getDataById);
router.put('/:id', updateData);
router.post('/:id/order', orderData);
router.get('/orders/:employeeId', getOrderedData);
router.post('/:id/cancel', cancelData);
router.get('/canceled/:employeeId', getCanceledData);
router.get('/callbacks/:employeeId', getCallbackData);
router.get('/order/:id', getOrderDataById);
router.get('/cancel/:id', getCancelDataById);
router.get('/callback/:id', getCallbackDataById);
router.put('/order/:id/status', updateOrderStatus);
router.delete('/order/:id/product/:productId', deleteProductFromOrder);
router.put('/order/:id', updateOrder);
router.get('/orders/status/verify', getVerifyStatusOrders);
router.put('/:id/status/hold', updateDataHoldStatus);
router.put('/:id/status/callback', updateDataCallbackStatus);
router.get('/hold/:employeeId', getHoldData);
router.get('/hold/:id', getHoldDataById);
module.exports = router;
