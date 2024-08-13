// controllers/historyController.js
const History = require("../models/History");
const User = require("../models/User");
const Data = require("../models/Data");
const moment = require('moment-timezone');


exports.recordLoginHistory = async (req, res) => {
    const { employeeId, type } = req.body;
   // console.log("Request received:", req.body);
    try {
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const history = await History.findOne({ user: user._id });

        const loginEntry = {
            userInfo: [employeeId, user._id.toString()],
            time: new Date(),
            type,
        };

        if (history) {
            history.loginHistory.push(loginEntry);
            await history.save();
        } else {
            const newHistory = new History({
                user: user._id,
                loginHistory: [loginEntry],
                assignmentHistory: [],
            });
            await newHistory.save();
        }

        res.status(201).json({ message: "Login history recorded" });
    } catch (error) {
        console.error('Error recording login history:', error); 
        res.status(500).json({ message: "Internal server error", error });
    }
};



// exports.recordAssignmentHistory = async (req, res) => {
//     const { previousEmployeeId, currentEmployeeId, previousDepartment, currentDepartment, dataId, status } = req.body; // Added status here
//     console.log(req.body);

//     try {
//         const currentUser = await User.findOne({ employeeId: currentEmployeeId });
//         const previousUser = await User.findOne({ employeeId: previousEmployeeId });
//         const data = await Data.findById(dataId);

//         if (!currentUser || !data) {
//             return res.status(404).json({ message: "User or Data not found" });
//         }

//         // Get the latest history entry for the current dataId
//         const previousHistory = await History.findOne({ "assignmentHistory.dataId": dataId }).sort({ "assignmentHistory.time": -1 });

//         let previousUserInfo = null;
//         if (previousHistory) {
//             // Find the latest assignment for this dataId
//             const previousAssignment = previousHistory.assignmentHistory.find(assignment => assignment.dataId.toString() === dataId.toString());

//             if (previousAssignment && previousAssignment.currentUserInfo) {
//                 // Set the previousUserInfo to the currentUserInfo of the last assignment
//                 previousUserInfo = {
//                     employeeId: previousAssignment.currentUserInfo.employeeId,
//                     userId: previousAssignment.currentUserInfo.userId,
//                     name: previousAssignment.currentUserInfo.name,
//                     department: previousAssignment.currentUserInfo.department,
//                     time: previousAssignment.currentUserInfo.time // retain the original assignment time
//                 };
//             }
//         }

//         // Set current user information
//         const currentUserInfo = {
//             employeeId: currentEmployeeId,
//             userId: currentUser._id,
//             name: currentUser.name,
//             department: currentDepartment,
//             time: new Date()
//         };

//         const assignmentEntry = {
//             currentUserInfo,
//             previousUserInfo,
//             dataId,
//             customerId: data.customerId,
//             status // Set status here
//         };

//         // Check if the current user already has a history document
//         let userHistory = await History.findOne({ userId: currentUser._id });

//         if (!userHistory) {
//             // If no history document exists, create a new one
//             userHistory = new History({
//                 userId: currentUser._id,
//                 employeeId: currentEmployeeId,
//                 assignmentHistory: [assignmentEntry]
//             });
//         } else {
//             // If a history document exists, append the new assignment entry
//             userHistory.assignmentHistory.push(assignmentEntry);
//         }

//         await userHistory.save();

//         res.status(201).json({ message: 'Assignment history recorded successfully', history: userHistory });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while recording assignment history', error });
//     }
// };

exports.getHistory = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Find the user by employeeId
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the history related to the user
        const history = await History.findOne({ user: user._id });

        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }

        // Extract and format the login history
        const formattedLoginHistory = history.loginHistory.map(entry => ({
            type: entry.type,  // Extract the type
            time: moment(entry.time) // Convert the time to the desired timezone and format
                .tz('Asia/Kolkata') // Replace with your desired timezone
                .format('YYYY-MM-DD HH:mm:ss'), // Customize the format as needed
        }));

        // Send only the formatted login history
        res.status(200).json({ loginHistory: formattedLoginHistory });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
// exports.getAssignmentHistoryByCustomerId = async (req, res) => {
//     const { customerId } = req.params;

//     try {
//         const histories = await History.find({ "assignmentHistory.customerId": customerId });

//         if (!histories || histories.length === 0) {
//             return res.status(404).json({ message: "Assignment history not found for the given customerId" });
//         }

//         const assignmentHistories = histories.map(history => history.assignmentHistory).flat();
//         const filteredAssignmentHistories = assignmentHistories.filter(assignment => assignment.customerId === customerId);

//         res.status(200).json(filteredAssignmentHistories);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// };
