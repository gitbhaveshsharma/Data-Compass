const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
    number: { type: String, required: true },
    dataId: { type: String, ref: 'Data', required: true },
    department: { type: String, required: true },
    employeeId: { type: String, ref: 'Employee', required: true },
    alarmTime: { type: Date, required: true },
    customerName: { type: String, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    comment: { type: String, required: false }, 
});

module.exports = mongoose.model('Alarm', alarmSchema);
