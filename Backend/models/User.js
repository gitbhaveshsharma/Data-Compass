// User model
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "employee"], // Optional: restrict role values
        default: "employee",
    },
    department: {
        type: String,
        required: true,
    },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // Don't re-hash if password is not modified
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
