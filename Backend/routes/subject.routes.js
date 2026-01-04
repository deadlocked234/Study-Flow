const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Subject = require('../models/Subject');

// Get io instance
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
module.exports.setIo = setIo;

// @desc    Get all subjects for user
// @route   GET /api/subjects
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.user.id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, category, color, description, targetHours, priority } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const subject = await Subject.create({
            user: req.user.id,
            name,
            category: category || 'General',
            color: color || '#8b5cf6',
            description,
            targetHours: targetHours || 0,
            priority: priority || 'medium'
        });

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('subject-created', subject);
        }

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { name, category, color, description, targetHours, priority } = req.body;

    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        if (subject.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        subject.name = name || subject.name;
        subject.category = category || subject.category;
        subject.color = color || subject.color;
        subject.description = description || subject.description;
        subject.targetHours = targetHours !== undefined ? targetHours : subject.targetHours;
        subject.priority = priority || subject.priority;

        const updatedSubject = await subject.save();

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('subject-updated', updatedSubject);
        }

        res.json(updatedSubject);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid subject ID' });
        }
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:name
// @access  Private
router.delete('/:name', protect, async (req, res) => {
    try {
        const subject = await Subject.findOne({
            user: req.user.id,
            name: decodeURIComponent(req.params.name)
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        await Subject.findByIdAndDelete(subject._id);

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('subject-deleted', req.params.name);
        }

        res.json({ message: 'Subject removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get subject analytics
// @route   GET /api/subjects/analytics/overview
// @access  Private
router.get('/analytics/overview', protect, async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.user.id });
        const sessions = await require('../models/Session').find({ user: req.user.id });

        // Calculate analytics
        const subjectStats = {};
        const categoryStats = {};
        let totalTargetHours = 0;
        let totalStudyTime = 0;

        subjects.forEach(subject => {
            subjectStats[subject.name] = {
                sessions: 0,
                time: 0,
                targetHours: subject.targetHours,
                category: subject.category,
                color: subject.color,
                priority: subject.priority
            };
            totalTargetHours += subject.targetHours;

            if (!categoryStats[subject.category]) {
                categoryStats[subject.category] = { subjects: 0, time: 0 };
            }
            categoryStats[subject.category].subjects++;
        });

        sessions.forEach(session => {
            const subjectName = session.subject || 'Unspecified';
            if (subjectStats[subjectName]) {
                subjectStats[subjectName].sessions++;
                subjectStats[subjectName].time += session.duration;
                totalStudyTime += session.duration;

                const category = subjectStats[subjectName].category;
                if (categoryStats[category]) {
                    categoryStats[category].time += session.duration;
                }
            }
        });

        res.json({
            subjectStats,
            categoryStats,
            totalTargetHours,
            totalStudyTime,
            completionRate: totalTargetHours > 0 ? (totalStudyTime / (totalTargetHours * 60)) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
module.exports.setIo = setIo;