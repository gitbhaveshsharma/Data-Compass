const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateEmployeeId = (firstName, lastName) => {
    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000); 
    return initials + randomNum;
};

exports.login = async (req, res) => {
    const { employeeId, password } = req.body;

    try {
        const user = await User.findOne({ employeeId });
        // const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // // console.log('Password comparison result:', isPasswordCorrect); // Debugging line


        // Check if the user exists and if the password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // console.error('Invalid login attempt: Employee ID or password is incorrect.');
            return res.status(400).send({ error: 'Invalid employee ID or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, department: user.department, employeeId: user.employeeId },
            process.env.JWT_SECRET,
            { expiresIn: '13h' }
        );

        res.send({ token, user: { id: user._id, role: user.role, department: user.department, employeeId: user.employeeId } });
    } catch (error) {
        // Log the error with detailed information
        // console.error('Error during login:', error);
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
