const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const { admin } = require('../middleware/admin.middleware');

// Get all users
router.get('/users', admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin analytics summary
router.get('/analytics', admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Support legacy docs where user was stored in userId
        const sessionAgg = await Session.aggregate([
            {
                $addFields: {
                    userResolved: { $ifNull: ['$user', '$userId'] }
                }
            },
            {
                $group: {
                    _id: '$userResolved',
                    totalMinutes: { $sum: '$duration' },
                    totalSessions: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    username: { $ifNull: ['$userInfo.username', 'Unknown'] },
                    totalMinutes: 1,
                    totalSessions: 1
                }
            }
        ]);

        const totalMinutes = sessionAgg.reduce((sum, s) => sum + s.totalMinutes, 0);
        const totalSessions = sessionAgg.reduce((sum, s) => sum + s.totalSessions, 0);

        res.json({
            totalUsers,
            totalMinutes,
            totalSessions,
            perUser: sessionAgg
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const bcrypt = require('bcryptjs');

// Delete user (prevent admin deletion)
router.delete('/users/:id', admin, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if trying to delete an admin
        if (userToDelete.role === 'admin') {
            return res.status(403).json({ 
                message: 'Cannot delete admin users. Use demote-admin endpoint instead.' 
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all admins
router.get('/admins', admin, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.json({ admins, count: admins.length });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Promote user to admin
router.put('/users/:id/promote', admin, async (req, res) => {
    try {
        // Optional super admin guard: only SUPER_ADMIN_USERNAME can change roles
        if (process.env.SUPER_ADMIN_USERNAME && req.user && req.user.username !== process.env.SUPER_ADMIN_USERNAME) {
            return res.status(403).json({ message: 'Only super admin can manage roles' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'User is already an admin' });
        }

        user.role = 'admin';
        await user.save();
        
        res.json({ 
            success: true, 
            message: `${user.username} promoted to admin`,
            user: { username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Demote admin to user
router.put('/users/:id/demote', admin, async (req, res) => {
    try {
        // Optional super admin guard: only SUPER_ADMIN_USERNAME can change roles
        if (process.env.SUPER_ADMIN_USERNAME && req.user && req.user.username !== process.env.SUPER_ADMIN_USERNAME) {
            return res.status(403).json({ message: 'Only super admin can manage roles' });
        }

        const adminToDemote = await User.findById(req.params.id);
        
        if (!adminToDemote) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (adminToDemote.role !== 'admin') {
            return res.status(400).json({ message: 'User is not an admin' });
        }

        // Prevent removing the last admin
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(403).json({ 
                message: 'Cannot demote the last admin. There must be at least one admin.' 
            });
        }

        adminToDemote.role = 'user';
        await adminToDemote.save();
        
        res.json({ 
            success: true, 
            message: `${adminToDemote.username} demoted to user`,
            user: { username: adminToDemote.username, email: adminToDemote.email, role: adminToDemote.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin change user password
router.put('/users/:id/password', admin, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;