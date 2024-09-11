const mongoose = require('mongoose');

const IP = new mongoose.Schema({
    IPAddress : { type: String, required: true },
    name : { type: String, required: true },
    status :  {type: String, default: 'Active', enum: ['Active', 'Block']},
})

module.exports = mongoose.model('IP', IP);