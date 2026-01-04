#!/usr/bin/env node

/**
 * StudyFlow Deployment Helper
 * Run this script to check if your app is ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 StudyFlow Deployment Readiness Check\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
} else {
    console.log('❌ .env file missing - create it with your environment variables');
}

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (package.scripts && package.scripts.start) {
        console.log('✅ package.json has start script');
    } else {
        console.log('❌ package.json missing start script');
    }
}

// Check server.js
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (serverContent.includes('process.env.PORT')) {
        console.log('✅ Server uses process.env.PORT');
    } else {
        console.log('❌ Server does not use process.env.PORT');
    }
}

// Check .gitignore
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignore.includes('.env')) {
        console.log('✅ .gitignore excludes .env');
    } else {
        console.log('❌ .gitignore does not exclude .env');
    }
}

console.log('\n📋 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Go to Railway.app or Render.com');
console.log('3. Connect your GitHub repo');
console.log('4. Set environment variables: MONGO_URI, JWT_SECRET, NODE_ENV=production');
console.log('5. Deploy and get your live URL!');

console.log('\n🎉 Your StudyFlow app will be live and accessible from anywhere!');