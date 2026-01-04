const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        console.log('Registration attempt:', { username, email, firstName, lastName });
        console.log('Password provided:', !!password);

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User or Email already exists' });
        }

        console.log('Creating user...');
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        console.log('User created:', user.username);
        console.log('User password after creation:', user.password.substring(0, 20) + '...');

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt for username:', username);
        const user = await User.findOne({ username });
        console.log('User found:', !!user);

        if (user) {
            console.log('Stored password hash:', user.password);
            const isMatch = await user.matchPassword(password);
            console.log('Password match:', isMatch);

            if (isMatch) {
                res.json({
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    token: generateToken(user._id)
                });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    // Middleware will handle verification, we just confirm logic here if needed
    // Assuming 'protect' middleware is used in server.js routing
    // But for safety, let's verify token manually if middleware wasn't applied here directly
    
    // NOTE: Better to rely on the 'protect' middleware. 
    // This route is often handled by just returning req.user from middleware
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token' });
    }
});

module.exports = router;