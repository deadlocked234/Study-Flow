const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    color: { type: String, default: '#8b5cf6' },
    description: String,
    targetHours: { type: Number, default: 0 }, // Weekly target in hours
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);