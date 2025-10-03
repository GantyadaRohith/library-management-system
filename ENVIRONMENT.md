# Environment Variables for Vercel Deployment

## Server Environment Variables (Required)
Add these in your Vercel project settings:

### Database
- `MONGO_URI`: MongoDB connection string (e.g., mongodb+srv://username:password@cluster.mongodb.net/library)

### Authentication
- `JWT_SECRET`: Strong secret key for JWT tokens (minimum 32 characters)

### Email Configuration (Optional - for notifications)
- `EMAIL_USER`: Gmail address for sending notifications
- `EMAIL_PASS`: Gmail app password (not regular password)

### Deployment
- `NODE_ENV`: Set to "production"
- `FRONTEND_URL`: Your Vercel app URL (e.g., https://your-app-name.vercel.app)

## Client Environment Variables (Optional)
- `REACT_APP_API_URL`: API base URL (auto-detected if not set)

## Example .env file for local development:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/library
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=development
```

## Vercel Environment Setup:
1. Go to your Vercel project dashboard
2. Click "Settings" -> "Environment Variables"
3. Add each variable with its value
4. Make sure to set them for "Production" environment