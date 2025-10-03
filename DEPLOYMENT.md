# 🚀 Deploying Library Management System to Vercel

This guide will help you deploy your full-stack Library Management System to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step-by-Step Deployment

### 1. Prepare Your MongoDB Database

1. Create a MongoDB Atlas cluster (free tier is sufficient for testing)
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel access
4. Get your connection string (it should look like this):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/library
   ```

### 2. Deploy to Vercel

1. **Connect GitHub Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: **Other**
   - Root Directory: **leave empty** (it's a monorepo)
   - Build and Output Settings: **use defaults**

3. **Set Environment Variables**:
   Go to "Settings" → "Environment Variables" and add:

   **Required Variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_minimum_32_characters
   NODE_ENV=production
   ```

   **Optional (for email notifications):**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

   **Optional (if needed):**
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### 3. Post-Deployment Setup

1. **Create Admin User**:
   After deployment, you'll need to create an admin user. The system includes a script for this:
   
   - Go to your Vercel Functions tab
   - You can create an admin user through the database directly or modify the register endpoint temporarily

2. **Test Your Application**:
   - Visit your Vercel app URL
   - Try registering as a student
   - Test login functionality
   - Test book browsing

### 4. Domain Configuration (Optional)

1. **Custom Domain**:
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**:
   If using a custom domain, update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://yourdomain.com
   ```

## 🔧 Configuration Files Explained

### `vercel.json`
This file configures how Vercel builds and routes your application:
- Routes API calls to serverless functions in `/api`
- Serves the React app for all other requests
- Handles SPA routing with rewrites

### `package.json` (root)
Defines build commands for the monorepo structure:
- Installs dependencies for both client and server
- Builds the React application

### `/api` Directory
Contains serverless functions that replace your Express server:
- Each route becomes a separate serverless function
- Shares database connection efficiently
- Handles CORS and authentication

## 🐛 Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure environment variables are set correctly
- Review build logs in Vercel dashboard

### Runtime Errors
- Check Function logs in Vercel dashboard
- Verify MongoDB connection string
- Ensure JWT_SECRET is set

### CORS Issues
- Make sure `FRONTEND_URL` matches your actual domain
- Check that API calls use relative paths (`/api/...`)

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has proper permissions

## 📱 API Endpoints

After deployment, your API will be available at:
```
https://your-app-name.vercel.app/api/auth/login
https://your-app-name.vercel.app/api/books
https://your-app-name.vercel.app/api/requests
https://your-app-name.vercel.app/api/admin
```

## 🔄 Continuous Deployment

- Every push to your main branch will trigger a new deployment
- Preview deployments are created for pull requests
- You can roll back to previous deployments in the Vercel dashboard

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

## 🆘 Need Help?

If you encounter issues:
1. Check the Vercel Function logs
2. Verify all environment variables are set
3. Test API endpoints directly
4. Review MongoDB Atlas connection logs

---

**🎉 Congratulations!** Your Library Management System should now be live on Vercel!