// // registerController.js
// const User = require("../models/User"); // Import User model

// async function register(email, password, name, role, department) {
//     try {
//         // Check for existing user
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return { error: "User alreadya exists" }; // Return error if email exists
//         }

//         // Create new user
//         const newUser = new User({
//             email,
//             password,
//             name,
//             role: role || "employee",
//             department
//         });

//         await newUser.save(); // Save the user to the database

//         return { message: "User created successfully" };
//         // console.log("User created successfully:", newUser);
//     } catch (error) {
//         console.error(error);
//         return { error: "Registration failed" }; // Generic error for debugging
//     }
// }

// module.exports = { register };
