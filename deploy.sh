#!/bin/bash
# Quick deployment script for Windows (save as deploy.bat)

echo "🚀 Quick Deploy Script"
echo "======================"

echo "📝 Adding all changes..."
git add -A

echo "💬 Enter commit message (or press Enter for auto message):"
read -r message

if [ -z "$message" ]; then
    message="Quick deploy - $(date)"
fi

echo "📦 Committing changes..."
git commit -m "$message"

echo "🌐 Pushing to GitHub (will auto-deploy to Netlify)..."
git push

echo "✅ Deployment initiated! Check https://app.netlify.com/sites/gantyadarohith-library/deploys"
echo "🔗 Your site: https://gantyadarohith-library.netlify.app"

# Wait a moment and open the deploy page
sleep 2
start https://app.netlify.com/sites/gantyadarohith-library/deploys