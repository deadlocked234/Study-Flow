const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Goal = require('../models/Goal');
const Session = require('../models/Session');
const Task = require('../models/Task');

// Get io instance
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
module.exports.setIo = setIo;

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, type, target, unit, subject, deadline, priority, category } = req.body;

    if (!title || !type || !target || !unit || !deadline) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const goal = await Goal.create({
            user: req.user.id,
            title,
            description,
            type,
            target,
            unit,
            subject,
            deadline: new Date(deadline),
            priority: priority || 'medium',
            category: category || 'General'
        });

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('goal-created', goal);
        }

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                goal[key] = updates[key];
            }
        });

        // Check if goal is completed
        if (goal.current >= goal.target && !goal.completed) {
            goal.completed = true;
            goal.completedAt = new Date();
        }

        const updatedGoal = await goal.save();

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('goal-updated', updatedGoal);
        }

        res.json(updatedGoal);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid goal ID' });
        }
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Goal.findByIdAndDelete(req.params.id);

        // Emit real-time event
        if (io) {
            io.to(`user_${req.user.id}`).emit('goal-deleted', req.params.id);
        }

        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update goal progress automatically
// @route   POST /api/goals/update-progress
// @access  Private
router.post('/update-progress', protect, async (req, res) => {
    try {
        const goals = await Goal.find({
            user: req.user.id,
            completed: false,
            deadline: { $gte: new Date() }
        });

        const now = new Date();
        let updatedCount = 0;

        for (const goal of goals) {
            let newCurrent = goal.current;

            switch (goal.type) {
                case 'daily':
                    if (goal.unit === 'hours') {
                        const todaySessions = await Session.find({
                            user: req.user.id,
                            timestamp: {
                                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                            }
                        });
                        newCurrent = todaySessions.reduce((sum, session) => sum + session.duration, 0) / 60;
                    } else if (goal.unit === 'sessions') {
                        const todaySessions = await Session.find({
                            user: req.user.id,
                            timestamp: {
                                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                            }
                        });
                        newCurrent = todaySessions.length;
                    }
                    break;

                case 'weekly':
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    if (goal.unit === 'hours') {
                        const weekSessions = await Session.find({
                            user: req.user.id,
                            timestamp: { $gte: weekStart, $lte: now }
                        });
                        newCurrent = weekSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
                    }
                    break;

                case 'subject-specific':
                    if (goal.subject) {
                        const subjectSessions = await Session.find({
                            user: req.user.id,
                            subject: goal.subject,
                            timestamp: { $gte: new Date(goal.createdAt), $lte: now }
                        });
                        newCurrent = goal.unit === 'hours' ?
                            subjectSessions.reduce((sum, session) => sum + session.duration, 0) / 60 :
                            subjectSessions.length;
                    }
                    break;

                case 'total-hours':
                    const allSessions = await Session.find({
                        user: req.user.id,
                        timestamp: { $gte: new Date(goal.createdAt), $lte: now }
                    });
                    newCurrent = allSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
                    break;
            }

            if (newCurrent !== goal.current) {
                goal.current = Math.min(newCurrent, goal.target);
                if (goal.current >= goal.target) {
                    goal.completed = true;
                    goal.completedAt = new Date();
                }
                await goal.save();
                updatedCount++;
            }
        }

        res.json({ message: `Updated ${updatedCount} goals` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });

        const stats = {
            total: goals.length,
            completed: goals.filter(g => g.completed).length,
            active: goals.filter(g => !g.completed && new Date(g.deadline) >= new Date()).length,
            overdue: goals.filter(g => !g.completed && new Date(g.deadline) < new Date()).length,
            completionRate: goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0,
            byType: {},
            byCategory: {}
        };

        goals.forEach(goal => {
            if (!stats.byType[goal.type]) stats.byType[goal.type] = { total: 0, completed: 0 };
            stats.byType[goal.type].total++;
            if (goal.completed) stats.byType[goal.type].completed++;

            if (!stats.byCategory[goal.category]) stats.byCategory[goal.category] = { total: 0, completed: 0 };
            stats.byCategory[goal.category].total++;
            if (goal.completed) stats.byCategory[goal.category].completed++;
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
module.exports.setIo = setIo;