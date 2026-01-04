# 🚀 StudyFlow - Professional Study Timer & Analytics App

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" alt="Socket.io" />
</div>

<div align="center">
  <h3>🎯 Boost Your Productivity with Smart Study Sessions</h3>
  <p>A beautiful, feature-rich study timer app with Pomodoro technique, analytics, music integration, and real-time notifications.</p>
</div>

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Timer%20Clock.png" width="50" height="50" alt="Timer" />
        <br><b>Pomodoro Timer</b>
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Chart%20Increasing.png" width="50" height="50" alt="Analytics" />
        <br><b>Study Analytics</b>
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Headphone.png" width="50" height="50" alt="Music" />
        <br><b>Music Integration</b>
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Notebook.png" width="50" height="50" alt="Tasks" />
        <br><b>Task Management</b>
      </td>
    </tr>
  </table>
</div>

### 🎯 Core Features
- ⏱️ **Advanced Pomodoro Timer** with customizable sessions
- 📊 **Detailed Analytics** with charts and progress tracking
- 🎵 **YouTube Music Integration** with playlist support
- 📝 **Task Management** with subjects and goals
- 🔐 **User Authentication** with JWT tokens
- 📱 **Responsive Design** for all devices
- 🔔 **Smart Notifications** with sound alerts
- 🌙 **Dark Theme** with smooth animations
- 📊 **Real-time Statistics** with Chart.js
- 🔄 **Real-time Updates** with Socket.IO

---

## 🛠️ Tech Stack

<div align="center">
  <h4>Frontend</h4>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />

  <h4>Backend</h4>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" alt="Socket.IO" />

  <h4>Tools & Libraries</h4>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Bcrypt-000000?style=for-the-badge&logo=bcrypt&logoColor=white" alt="Bcrypt" />
</div>

---

## 📋 Prerequisites

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Computer.png" width="30" height="30" alt="Computer" />
  <strong>Before you begin, ensure you have the following installed:</strong>
</div>

- 🟢 **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- 🍃 **MongoDB** (Local or Atlas) - [Download here](https://www.mongodb.com/)
- 📝 **Git** - [Download here](https://git-scm.com/)

---

## 🚀 Installation & Setup

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Rocket.png" width="40" height="40" alt="Rocket" />
  <h3>Let's get StudyFlow running on your machine!</h3>
</div>

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/studyflow.git
cd studyflow
```

### 2️⃣ Backend Setup
```bash
cd Backend
npm install
```

### 3️⃣ Environment Configuration
Create a `.env` file in the Backend directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/studyflow
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studyflow
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4️⃣ Start MongoDB
Make sure MongoDB is running locally or your Atlas connection is active.

### 5️⃣ Start the Application
```bash
# Backend
npm start
# or for development
npm run dev

# Frontend (in another terminal)
cd ../Frontend
# Serve with any static server (e.g., Live Server extension in VS Code)
# Or use Python: python -m http.server 5500
```

### 6️⃣ Access the App
Open your browser and go to: `http://localhost:3000`

---

## 📁 Project Structure

```
StudyFlow/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT authentication
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Session.js           # Study session model
│   │   ├── Task.js              # Task model
│   │   └── Subject.js           # Subject model
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── session.routes.js    # Session management
│   │   ├── task.routes.js       # Task routes
│   │   └── user.routes.js       # User routes
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env                     # Environment variables
├── Frontend/
│   ├── Index.html               # Main HTML file
│   ├── Assets/
│   │   ├── script.js            # Vue.js application
│   │   └── style.css            # Custom styles
│   └── Audio/                   # Audio files directory
└── README.md
```

---

## 🎮 Usage Guide

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Video%20Game.png" width="30" height="30" alt="Game" />
  <h3>How to use StudyFlow effectively</h3>
</div>

### 👤 Getting Started
1. **Register/Login** to create your account
2. **Set up your profile** with subjects and preferences
3. **Start your first study session** using the Pomodoro timer

### ⏱️ Using the Timer
- Choose your **focus duration** (default: 25 minutes)
- Select a **subject** for tracking
- Add a **task** if needed
- Click **Start** and focus! 🎯

### 🎵 Music Integration
- **YouTube Links**: Paste YouTube video URLs
- **Audio Files**: Upload local audio files
- **Playlists**: Create and manage multiple playlists
- **Controls**: Volume, speed, and playback controls

### 📊 Analytics
- View **daily/weekly/monthly** statistics
- Track **study time trends** with interactive charts
- Monitor **subject-wise progress**
- Analyze **productivity patterns**

---

## 🔧 API Endpoints

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/World%20Map.png" width="30" height="30" alt="API" />
  <h4>Backend API Documentation</h4>
</div>

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Sessions
- `GET /api/sessions` - Get all user sessions
- `POST /api/sessions` - Create new session

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Subjects
- `GET /api/subjects` - Get all user subjects
- `POST /api/subjects` - Create new subject

---

## 🤝 Contributing

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Handshake.png" width="30" height="30" alt="Contribute" />
  <h3>Want to contribute to StudyFlow?</h3>
</div>

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Scroll.png" width="30" height="30" alt="License" />
</div>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" width="30" height="30" alt="Thanks" />
  <h4>Special Thanks</h4>
</div>

- **Vue.js** for the amazing reactive framework
- **Chart.js** for beautiful data visualizations
- **Tailwind CSS** for utility-first styling
- **Phosphor Icons** for consistent iconography
- **The Open Source Community** for inspiration and tools

---

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Star.png" width="30" height="30" alt="Star" />
  <h3>Enjoy studying with StudyFlow!</h3>
  <p>If you find this project helpful, please give it a ⭐ star!</p>

  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Student.png" width="50" height="50" alt="Student" />
  <br>
  <strong>Happy Learning! 📚✨</strong>
</div></content>
