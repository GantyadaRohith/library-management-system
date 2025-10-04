@echo off
echo 🚀 Starting Library Management System Locally
echo ============================================

echo.
echo 📋 Step 1: Checking if MongoDB is running...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB:
    echo 1. Download from: https://www.mongodb.com/try/download/community
    echo 2. Or install via Chocolatey: choco install mongodb
    echo 3. Or install via Winget: winget install MongoDB.Server
    echo.
    pause
    exit /b 1
)

echo ✅ MongoDB is installed

echo.
echo 📋 Step 2: Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB service might not be running as a service
    echo    You may need to start it manually: mongod
)

echo.
echo 📋 Step 3: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo 📋 Step 4: Installing client dependencies...
cd ..\client
call npm install  
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete! 
echo.
echo 🚀 To start the application:
echo    1. Open terminal 1: cd server && npm run dev
echo    2. Open terminal 2: cd client && npm start
echo.
echo 🌐 Frontend will be at: http://localhost:3000
echo 🔧 Backend will be at: http://localhost:5000
echo.
pause