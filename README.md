# Library Management System

A full-stack application for managing library books, requests, and user accounts (students and librarians) using React, Express, and MongoDB.

## 🏗️ Structure
- `/client`: React frontend
- `/server`: Express backend (local development)
- MongoDB: Database

## ✨ Features
- List available books with search and filters
- Student and librarian account management
- Book request queue system
- Admin dashboard for user management
- Email notifications for overdue books
- Responsive design

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm run setup
   ```

2. **Configure environment**:
   - Copy `/server/.env.example` to `/server/.env`
   - Update MongoDB URI and other settings

3. **Run the application**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend  
   cd client && npm start
   ```

## 📋 Environment Variables

See [server/.env.example](server/.env.example) for the local environment template.

## 📚 Documentation

- [Client Documentation](./client/README.md) - Frontend details
- [Server Documentation](./server/README.md) - Backend details
- [Software Requirements Specification (SRS)](./SRS.md) - Detailed requirements
