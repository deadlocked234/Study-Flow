const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Session = require('../models/Session');

// Get io instance
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
module.exports.setIo = setIo;

// @desc    Get all sessions for user
// @route   GET /api/sessions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private
router.post('/', protect, async (req, res) => {
    const { subject, task, duration, timestamp } = req.body;

    if (!duration) {
        return res.status(400).json({ message: 'Duration is required' });
    }

    try {
        const session = await Session.create({
            user: req.user.id,
            subject,
            task,
            duration,
            timestamp: timestamp || Date.now()
        });

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('session-created', session);
        }

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
module.exports.setIo = setIo;