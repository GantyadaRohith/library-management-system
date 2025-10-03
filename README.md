# Library Management System

A full-stack application for managing library books, requests, and user accounts (students and librarians) using React, Express, and MongoDB.

## 🏗️ Structure
- `/client`: React frontend
- `/server`: Express backend (local development)
- `/api`: Serverless functions for Vercel deployment
- MongoDB: Database

## ✨ Features
- List available books with search and filters
- Student and librarian account management
- Book request queue system
- Admin dashboard for user management
- Email notifications for overdue books
- Responsive design

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/library-management-system)

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm run install-all
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

See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete environment variable documentation.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Vercel
- [Environment Setup](./ENVIRONMENT.md) - Environment variables
- [Client Documentation](./client/README.md) - Frontend details
- [Server Documentation](./server/README.md) - Backend details

---

**Ready to deploy?** Follow the [deployment guide](./DEPLOYMENT.md) to get your app live on Vercel in minutes!
