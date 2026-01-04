const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subject: { type: String, default: 'Unspecified' },
    task: String,
    duration: { type: Number, required: true }, // in minutes
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);