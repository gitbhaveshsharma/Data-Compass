const Alarm = require('../models/Alarm');
const moment = require('moment-timezone');

const createAlarm = async (req, res) => {
    const { number, dataId, department, employeeId, alarmTime, customerName, status, comment, date } = req.body;
    try {
        // Handle the case where the date is provided and adjust alarmTime accordingly
        let alarmDate = alarmTime;
        if (date) {
            alarmDate = moment(date).set({
                hour: moment(alarmTime).hour(),
                minute: moment(alarmTime).minute(),
                second: moment(alarmTime).second(),
            }).toDate();
        }

        const newAlarm = new Alarm({
            number,
            dataId,
            department,
            employeeId,
            alarmTime: alarmDate,
            customerName,
            status,
            comment, // Add comment field
        });

        const savedAlarm = await newAlarm.save();
        res.status(201).json(savedAlarm);
    } catch (error) {
        res.status(500).json({ message: 'Error creating alarm', error });
    }
};

const getAlarms = async (req, res) => {
    try {
        const alarms = await Alarm.find();
        const alarmsWithIST = alarms.map(alarm => {
            return {
                ...alarm._doc,
                alarmTime: moment(alarm.alarmTime).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
            };
        });
        res.status(200).json(alarmsWithIST);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alarms', error });
    }
};

const getAlarmById = async (req, res) => {
    try {
        const alarm = await Alarm.findById(req.params.id);
        if (!alarm) {
            return res.status(404).json({ message: 'Alarm not found' });
        }
        const alarmWithIST = {
            ...alarm._doc,
            alarmTime: moment(alarm.alarmTime).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        };
        res.status(200).json(alarmWithIST);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alarm', error });
    }
};

const getAlarmsByEmployeeId = async (req, res) => {
    try {
        const alarms = await Alarm.find({ employeeId: req.params.employeeId });
        const alarmsWithIST = alarms.map(alarm => {
            return {
                ...alarm._doc,
                alarmTime: moment(alarm.alarmTime).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
            };
        });
        res.status(200).json(alarmsWithIST);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alarms', error });
    }
};

const updateAlarm = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const alarm = await Alarm.findByIdAndUpdate(id, updatedData, { new: true });
        if (!alarm) {
            return res.status(404).json({ message: 'Alarm not found' });
        }
        res.status(200).json(alarm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAlarm = async (req, res) => {
    try {
        const alarm = await Alarm.findByIdAndDelete(req.params.id);
        if (!alarm) {
            return res.status(404).json({ message: 'Alarm not found' });
        }
        res.status(200).json({ message: 'Alarm deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting alarm', error });
    }
};

module.exports = {
    createAlarm,
    getAlarms,
    getAlarmById,
    getAlarmsByEmployeeId,
    updateAlarm,
    deleteAlarm,
};
