# 🛠️ Local Development Setup Guide

## 📋 Quick Setup (5 minutes)

### Step 1: Set up MongoDB Atlas (Free Cloud Database)
1. **Go to**: https://cloud.mongodb.com/
2. **Sign up** for free account
3. **Create new cluster** (select FREE tier)
4. **Create database user**:
   - Username: `admin`
   - Password: `password123` (or your choice)
5. **Add your IP to whitelist**:
   - Click "Network Access" → "Add IP Address" → "Add Current IP"
   - Or add `0.0.0.0/0` to allow all IPs (less secure but works)
6. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials

### Step 2: Update Server Configuration
Edit `server/.env` file and replace:
```
MONGO_URI=mongodb://localhost:27017/library
```
With your Atlas connection string:
```
MONGO_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
```

### Step 3: Start Development Servers
```bash
# Option 1: Start both servers at once
npm run dev

# Option 2: Start individually
# Terminal 1:
cd server
npm run dev

# Terminal 2: 
cd client
npm start
```

### Step 4: Access Your Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔧 Troubleshooting

### If server won't start:
1. Check if MongoDB Atlas connection string is correct
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Check server console for error messages

### If frontend can't connect to backend:
1. Make sure backend is running on port 5000
2. Check browser console for CORS errors
3. Verify API calls are going to `http://localhost:5000`

## 🎯 What Should Work After Setup:
- ✅ User registration and login
- ✅ Browse books
- ✅ Add books (for librarians)
- ✅ Request books
- ✅ View borrowed books
- ✅ Manage requests (for librarians)

---

**Need help?** Check the console logs for detailed error messages!