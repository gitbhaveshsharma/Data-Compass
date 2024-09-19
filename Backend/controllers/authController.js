const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const IP = require('../models/Ip');
const requestIp = require('request-ip');
require('dotenv').config();

const generateEmployeeId = (firstName, lastName) => {
    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000); 
    return initials + randomNum;
};




exports.login = async (req, res) => {
    const { employeeId, password } = req.body;
    let userIp = requestIp.getClientIp(req); // Use request-ip to get the IP address

    // Convert ::1 to 127.0.0.1 for local development
    if (userIp === '::1') {
        userIp = '192.168.0.103';
    }

    // console.log('Request IP:', userIp); // Debugging: Log the IP address from the request

    try {
        const user = await User.findOne({ employeeId });

        // Check if the user exists and if the password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ error: 'Invalid employee ID or password.' });
        }

        // Check IP verification for non-IT department users
        if (user.department !== 'IT') {
            // Retrieve all IPs to see what is stored in the database
            // const allIps = await IP.find({});
            // console.log('All IPs in DB:', allIps);

            const ipRecord = await IP.findOne({ ip: userIp });

           // console.log('DB IP Record:', ipRecord); // Debugging: Log the IP record from the database

            if (!ipRecord) {
                return res.status(403).send({ error: 'IP address is not registered.' });
            }

            if (ipRecord.status !== 'active') {
                return res.status(403).send({ error: 'IP address is not active.' });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, department: user.department, employeeId: user.employeeId },
            process.env.JWT_SECRET,
            { expiresIn: '13h' }
        );

        res.send({ token, user: { id: user._id, role: user.role, department: user.department, employeeId: user.employeeId } });
    } catch (error) {
        //console.error('Error during login:', error);
        res.status(500).send({ error: 'Server error.' });
    }
};


exports.register = async (req, res) => {
    const { email, password, name, role, department, employeeId } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        let newEmployeeId = employeeId;
        if (!newEmployeeId) {
            const [firstName, lastName] = name.split(' ');
            newEmployeeId = generateEmployeeId(firstName, lastName);
        }

        const existingEmployeeId = await User.findOne({ employeeId: newEmployeeId });
        if (existingEmployeeId) {
            return res.status(400).json({ error: 'Employee ID already exists.' });
        }

        const user = new User({ email, password, name, role, department, employeeId: newEmployeeId });
        await user.save();

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        // console.error('Registration error:', error); // Log the detailed error
        return res.status(500).json({ error: 'Server error.' });
    }
};
