// generateJWTSecret.js
const fs = require("fs");
const crypto = require("crypto");

// Generate a random string of 64 characters
const generateJWTSecret = () => {
    return crypto.randomBytes(32).toString("hex");
};

const jwtSecret = generateJWTSecret();

// Write the secret key to a .env file
fs.writeFileSync(".env", `JWT_SECRET=${jwtSecret}\n`, { flag: "a" });


