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
    city: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    zip: {
        type: String,
        default: '',
    },
    nearBy: {
        type: String,
        default: '',
    },
    area: {
        type: String,
        default: '',
    },
    altNumber: {
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