// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateEmployeeId = (firstName, lastName) => {
    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random 4 digit number
    return initials + randomNum;
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, department: user.department }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.send({ token, user: { id: user._id, role: user.role, department: user.department } });
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
};

exports.register = async (req, res) => {
    const { email, password, name, role, department, employeeId } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists.' });
        }

        let newEmployeeId = employeeId;
        if (!newEmployeeId) {
            const [firstName, lastName] = name.split(' ');
            newEmployeeId = generateEmployeeId(firstName, lastName);
        }

        const existingEmployeeId = await User.findOne({ employeeId: newEmployeeId });
        if (existingEmployeeId) {
            return res.status(400).send({ error: 'Employee ID already exists.' });
        }

        const user = new User({ email, password, name, role, department, employeeId: newEmployeeId });
        await user.save();
        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
};
