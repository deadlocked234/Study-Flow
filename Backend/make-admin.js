/* ==============================================
   🔐 Make User Admin Script
   ============================================== */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Make user admin by username or email
const makeAdmin = async (identifier) => {
    try {
        await connectDB();

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });

        if (!user) {
            console.error(`❌ User not found with username/email: ${identifier}`);
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`⚠️  ${user.username} is already an admin!`);
            process.exit(0);
        }

        // Update role to admin
        user.role = 'admin';
        await user.save();

        console.log('\n✅ Success! User promoted to admin:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👤 Username: ${user.username}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔐 Role: ${user.role}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// List all users (helper function)
const listUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({}).select('username email role');
        
        console.log('\n📋 All Users:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        users.forEach((user, index) => {
            const roleIcon = user.role === 'admin' ? '👑' : '👤';
            console.log(`${index + 1}. ${roleIcon} ${user.username} (${user.email}) - ${user.role}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Command line usage
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('\n🔐 Make User Admin Script');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📖 Usage:');
    console.log('  node make-admin.js <username or email>  - Make user admin');
    console.log('  node make-admin.js --list               - List all users\n');
    console.log('Examples:');
    console.log('  node make-admin.js salahuddin');
    console.log('  node make-admin.js salahuddin@example.com');
    console.log('  node make-admin.js --list\n');
    process.exit(0);
}

if (args[0] === '--list' || args[0] === '-l') {
    listUsers();
} else {
    makeAdmin(args[0]);
}
