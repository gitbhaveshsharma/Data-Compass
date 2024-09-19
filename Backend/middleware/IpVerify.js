const IP = require('../models/Ip');
const User = require('../models/User');
const requestIp = require('request-ip');

const ipVerify = async (req, res, next) => {
    try {
        // Get the client's IP address using request-ip
        let userIp = requestIp.getClientIp(req);

        // Convert ::1 to 127.0.0.1 for local development
        if (userIp === '::1') {
            userIp = '192.168.0.103';
        }

        // console.log('Request IP:', userIp); // Debugging: Log the IP address from the request

        // Fetch the user from the database
        const userId = req.user.id;
        const user = await User.findById(userId);

        // Check if the user exists and is from the IT department
        if (user && user.department === 'IT') {
            // Bypass IP verification for IT department employees
            return next();
        }

        // Fetch the IP details from the database
        const ipRecord = await IP.findOne({ ip: userIp });

        // console.log('DB IP Record:', ipRecord); // Debugging: Log the IP record from the database

        if (!ipRecord) {
            // IP not found in the database
            return res.status(403).json({ message: 'IP not registered' });
        }

        if (ipRecord.status === 'inactive') {
            // IP is inactive
            return res.status(403).json({ message: 'IP is inactive' });
        }

        // IP is registered and active, proceed to the next middleware
        next();
    } catch (error) {
        console.error('IP Verification Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = ipVerify;
