// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

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
    const { email, password, name, role, department } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists.' });
        }

        const user = new User({ email, password, name, role, department });
        await user.save();
        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Server error.' });
    }
};
