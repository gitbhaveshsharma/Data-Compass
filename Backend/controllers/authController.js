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
    //console.log(req.body)
    try {
        const user = await User.findOne({ employeeId });
        //console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ error: 'Invalid employee ID or password.' });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role, department: user.department, employeeId: user.employeeId }, process.env.JWT_SECRET, {
            expiresIn: '13h',
        });
        //console.log(token)
        //console.log(user)
        res.send({ token, user: { id: user._id, role: user.role, department: user.department, employeeId: user.employeeId } });
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
};

exports.register = async (req, res) => {
    // console.log('Registration request data:', req.body);
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
        // console.error('Registration error:', error); // Log the detailed error
        res.status(500).send({ error: 'Server error.' });
    }
};