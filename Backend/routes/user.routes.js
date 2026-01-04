const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User');

// Sob related models import kora holo clean-up er jonno
const Task = require('../models/Task');
const Session = require('../models/Session');
const Subject = require('../models/Subject');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    const { firstName, lastName, profileImage } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.profileImage = profileImage || user.profileImage;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            profileImage: updatedUser.profileImage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user account and ALL related data
// @route   DELETE /api/user/profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. User er sob data delete kora
        await Task.deleteMany({ user: req.user.id });
        await Session.deleteMany({ user: req.user.id });
        await Subject.deleteMany({ user: req.user.id });
        await Goal.deleteMany({ user: req.user.id });
        await Achievement.deleteMany({ user: req.user.id });

        // 2. User account delete kora
        await User.findByIdAndDelete(req.user.id);
        
        res.json({ message: 'User account and all data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Clear all user data (Keep account) - FIX for "Clear Data" button
// @route   DELETE /api/user/data
// @access  Private
router.delete('/data', protect, async (req, res) => {
    try {
        // Shudhu data delete hobe, account thakbe
        await Task.deleteMany({ user: req.user.id });
        await Session.deleteMany({ user: req.user.id });
        await Subject.deleteMany({ user: req.user.id });
        await Goal.deleteMany({ user: req.user.id });
        await Achievement.deleteMany({ user: req.user.id }); 

        res.json({ message: 'All user data cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Save/Update user data (subjects, sessions, tasks)
// @route   PUT /api/user/data
// @access  Private
router.put('/data', protect, async (req, res) => {
    const { subjects, sessions, tasks } = req.body;

    try {
        // Clear existing data
        await Task.deleteMany({ user: req.user.id });
        await Session.deleteMany({ user: req.user.id });
        await Subject.deleteMany({ user: req.user.id });

        // Save new subjects
        if (subjects && subjects.length > 0) {
            const subjectsWithUser = subjects.map(subject => ({
                ...subject,
                user: req.user.id
            }));
            await Subject.insertMany(subjectsWithUser);
        }

        // Save new sessions
        if (sessions && sessions.length > 0) {
            const sessionsWithUser = sessions.map(session => ({
                ...session,
                user: req.user.id
            }));
            await Session.insertMany(sessionsWithUser);
        }

        // Save new tasks
        if (tasks && tasks.length > 0) {
            const tasksWithUser = tasks.map(task => ({
                ...task,
                user: req.user.id
            }));
            await Task.insertMany(tasksWithUser);
        }

        res.json({ message: 'User data saved successfully' });
    } catch (error) {
        console.error('Save data error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;