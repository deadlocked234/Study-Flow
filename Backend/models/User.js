const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    profileImage: String,
    // 👇 নতুন রোল ফিল্ড যোগ করা হয়েছে
    role: {
        type: String,
        enum: ['user', 'admin'], // শুধু user বা admin হতে পারবে
        default: 'user'          // অটোমেটিক 'user' সেট হবে
    }
}, { timestamps: true });

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);