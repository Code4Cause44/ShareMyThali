const User = require('../models/User');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv'); 

dotenv.config(); 
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', 
    });
};

exports.registerUser = async (req, res) => {
    const { username, email, password, role, organizationName, organizationAddress } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Please enter all required fields: username, email, password, and role.' });
    }

    if (role === 'organization' && (!organizationName || !organizationAddress)) {
        return res.status(400).json({ message: 'For organizations, organization name and address are required.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with that username already exists.' });
        }

        user = await User.create({
            username,
            email,
            password, 
            role,
            organizationName: role === 'organization' ? organizationName : undefined,
            organizationAddress: role === 'organization' ? organizationAddress : undefined,
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            organizationName: user.organizationName,
            organizationAddress: user.organizationAddress,
            token: token,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            organizationName: user.organizationName,
            organizationAddress: user.organizationAddress,
            token: token,
            message: 'Logged in successfully'
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};