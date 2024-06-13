// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    department: String,
});

module.exports = mongoose.model('User', userSchema);
