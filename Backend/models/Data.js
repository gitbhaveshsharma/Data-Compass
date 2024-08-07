// backend/models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    customerId: String,
    name: String,
    number: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    nearBy: String,
    area: String,
    altNumber: String,
    status: { type: String, default: 'unassigned' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    employeeId: { type: String, default: null },
    department: String,
    activeDate: { type: Date, default: Date.now }, // New field to store the active date
});

module.exports = mongoose.model('Data', dataSchema);
