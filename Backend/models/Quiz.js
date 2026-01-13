const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    topic: { 
        type: String, 
        required: true 
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number // Index
    }],
    score: { 
        type: Number,
        default: 0 
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
