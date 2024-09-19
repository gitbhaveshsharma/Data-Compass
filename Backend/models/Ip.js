const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('IP', ipSchema);
