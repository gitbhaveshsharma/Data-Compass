const express = require('express');
const { createAlarm, getAlarms, getAlarmById, getAlarmsByEmployeeId, updateAlarm, deleteAlarm } = require('../controllers/alarmController');
const router = express.Router();

router.post('/', createAlarm);
router.get('/', getAlarms);
router.get('/:id', getAlarmById);
router.get('/employee/:employeeId', getAlarmsByEmployeeId);
router.put('/:id', updateAlarm);
router.delete('/:id', deleteAlarm);

module.exports = router;
