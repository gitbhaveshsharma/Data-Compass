const express = require('express');
const { registerIP, updateIP, deleteIP, getIP, updateStatus } = require('../controllers/ipController');
const router = express.Router();

router.post('/register', registerIP);
router.put('/update/:ip', updateIP);
router.delete('/delete/:ip', deleteIP);
router.get('/', getIP);
router.put('/ips/toggle-status/:ip', updateStatus);


module.exports = router;
