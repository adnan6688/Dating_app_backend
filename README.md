# Dating App Backend

A scalable and secure backend for a modern dating application built with **Node.js, Express, TypeScript, and MongoDB**. It provides real-time features like matching, chat, and notifications with a clean and modular REST API architecture.

---

## 🚀 Features

### 🔐 Authentication

* JWT-based authentication
* Secure login and registration
* Password hashing with bcrypt
* Protected routes middleware

### 👤 User Management

* User profile creation and update
* Profile photos upload support
* Bio, interests, and preferences
* Account delete and deactivate option

### 💞 Matching System

* Swipe (like/dislike) functionality
* Mutual match detection
* Smart matching based on preferences

### 💬 Real-time Chat

* One-to-one messaging between matched users
* Socket.IO for real-time communication
* Message history stored in MongoDB
* Online/offline status tracking

### 📍 Location Features

* Nearby user discovery
* Distance-based filtering
* Location preference settings

### ❤️ Interaction System

* Like and Super Like system
* Block and report users
* Unmatch functionality

### 🔔 Notifications

* Real-time notifications
* Match and message alerts
* Event-based triggers

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB & Mongoose
* Socket.IO
* JWT Authentication
* Redis (optional)

---

## 📁 Project Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── services/
 ├── middlewares/
 ├── utils/
 ├── config/
 └── server.ts
```

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-username/dating-app-backend.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 🔑 Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🧪 Scripts

```bash
npm run dev       # Development server
npm run build     # Build TypeScript
npm start         # Production server
npm run lint      # Lint code
```

---

## 📡 API Features Overview

* RESTful API design
* Authentication & authorization
* Real-time messaging
* User interaction system

---

## 📌 Notes

* Designed for scalability and production use
* Modular architecture for easy extension
* Can be integrated with frontend (React / React Native)

---

## 📄 License

This project is licensed for personal and educational use.
