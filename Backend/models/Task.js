const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true }, // Changed from text to title to match AI integration
    description: String,
    deadline: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

// Frontend expects 'id', MongoDB gives '_id'. Let's convert it.
taskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Task', taskSchema);