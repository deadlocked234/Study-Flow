const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'subject-specific', 'total-hours'],
        required: true
    },
    target: {
        type: Number,
        required: [true, 'Please add a target value']
    },
    current: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        enum: ['hours', 'sessions', 'tasks', 'days'],
        required: true
    },
    subject: {
        type: String, // For subject-specific goals
        default: null
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline']
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        default: 'General'
    }
}, {
    timestamps: true
});

// Index for efficient queries
goalSchema.index({ user: 1, type: 1, completed: 1 });
goalSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model('Goal', goalSchema);