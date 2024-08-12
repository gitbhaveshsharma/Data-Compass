const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        // Check if the Authorization header exists
        const authHeader = req.header('Authorization');
        // console.log('Authorization Header:', authHeader); // Log the header

        if (!authHeader) {
            return res.status(401).send({ error: 'Access denied. No token provided.' });
        }

        // Extract the token from the Authorization header
        const token = authHeader.replace('Bearer ', '');
        // console.log('Token:', token); // Log the token

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded Token:', decoded); // Log the decoded token

        // Find the user by ID
        req.user = await User.findById(decoded.id);
        // console.log('User:', req.user); // Log the user

        if (!req.user) {
            return res.status(401).send({ error: 'User not found.' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication Error:', error); // Log the error
        res.status(401).send({ error: 'Invalid token.' });
    }
};

module.exports = auth;
