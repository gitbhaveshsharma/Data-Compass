const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
    number: { type: String, required: true },
    dataId: { type: mongoose.Schema.Types.ObjectId, ref: 'Data', required: true },
    department: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    alarmTime: { type: Date, required: true },
    customerName: { type: String, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

module.exports = mongoose.model('Alarm', alarmSchema);
