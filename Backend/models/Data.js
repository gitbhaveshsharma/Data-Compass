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
    fleadEmployeeIds: [{ type: String }],  // Array to store flead employee IDs
    verifyEmployeeIds: [{ type: String }],  // Array to store verify employee IDs
    reworkEmployeeIds: [{ type: String }],  // Array to store rework employee IDs
    rtoEmployeeIds: [{ type: String }],     // Array to store rto employee IDs
    department: String,
    activeDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Data', dataSchema);
