@echo off
REM Quick deployment script for Windows

echo 🚀 Quick Deploy Script
echo ======================

echo 📝 Adding all changes...
git add -A

set /p message="💬 Enter commit message (or press Enter for auto message): "

if "%message%"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%a/%%b/%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    set message=Quick deploy - !mydate! !mytime!
)

echo 📦 Committing changes...
git commit -m "%message%"

echo 🌐 Pushing to GitHub (will auto-deploy to Netlify)...
git push

echo ✅ Deployment initiated! Check https://app.netlify.com/sites/gantyadarohith-library/deploys
echo 🔗 Your site: https://gantyadarohith-library.netlify.app

REM Wait a moment and open the deploy page
timeout /t 2 /nobreak >nul
start https://app.netlify.com/sites/gantyadarohith-library/deploys