// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    loginHistory: [
        {
            userInfo: [String], 
            time: Date,
            type: {
                type: String,
                enum: ["login", "logout", "manual-logout", "auto-logout","inactivity-logout"],
            },
        },
    ],
    // assignmentHistory: [
    //     {
    //         currentUserInfo: {
    //             employeeId: String,
    //             userId: mongoose.Schema.Types.ObjectId,
    //             name: String, 
    //             department: String,
    //             time: Date,
    //         },
    //         previousUserInfo: {
    //             employeeId: String,
    //             userId: mongoose.Schema.Types.ObjectId,
    //             name: String, 
    //             department: String,
    //             time: Date,
    //         },
    //         dataId: mongoose.Schema.Types.ObjectId,
    //         customerId: String,
    //         status: String,
    //     },
    // ],
});

module.exports = mongoose.model("History", historySchema);
