const express = require('express');
const {
    distributeData,
    getDataCounts,
    getAssignedData,
    getDataById,
    updateData,
    orderData,
    cancelData,
    callbackData,
    getOrderedData,
    getCanceledData,
    getCallbackData,
    getOrderDataById,
    getCancelDataById,
    getCallbackDataById,
    updateOrderStatus,
    deleteProductFromOrder,
    updateOrder
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
router.post('/:id/callback', callbackData);
router.get('/callbacks/:employeeId', getCallbackData);
router.get('/order/:id', getOrderDataById);
router.get('/cancel/:id', getCancelDataById);
router.get('/callback/:id', getCallbackDataById);
router.put('/order/:id/status', updateOrderStatus);
router.delete('/order/:id/product/:productId', deleteProductFromOrder);
router.put('/order/:id', updateOrder);

module.exports = router;
