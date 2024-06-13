// backend/models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    number: String,
    address: String,
    status: { type: String, default: 'unassigned' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    department: String,
});

module.exports = mongoose.model('Data', dataSchema);
