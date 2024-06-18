// models/Cancel.js
const mongoose = require('mongoose');

const CancelSchema = new mongoose.Schema({
    dataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: '',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Cancel', CancelSchema);
