# Backend Requirements

## System Requirements

- **Node.js**: Version 16.0.0 or higher (recommended: 18.x or 20.x)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **MongoDB**: Version 4.4 or higher (local installation or cloud service like MongoDB Atlas)
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 512MB RAM (recommended: 1GB or more)

## Dependencies

### Production Dependencies

These packages are required for the application to run in production:

| Package | Version | Description |
|---------|---------|-------------|
| `axios` | ^1.12.2 | HTTP client for making external API requests |
| `bcryptjs` | ^3.0.2 | Password hashing library for secure authentication |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| `dotenv` | ^16.0.0 | Environment variable loader from .env files |
| `express` | ^4.18.2 | Fast, minimalist web framework for Node.js |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `mongoose` | ^7.0.0 | MongoDB object modeling library |
| `node-cron` | ^3.0.3 | Task scheduler for running scheduled jobs |
| `nodemailer` | ^6.9.0 | Email sending library |
| `validator` | ^13.15.15 | String validation and sanitization library |

### Development Dependencies

These packages are only needed during development:

| Package | Version | Description |
|---------|---------|-------------|
| `nodemon` | ^3.0.0 | Development server with auto-restart on file changes |

## Installation Instructions

### Prerequisites

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install MongoDB**
   
   **Option A: Local MongoDB Installation**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation guide for your operating system
   - Start MongoDB service
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string

### Setup Steps

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install development dependencies**
   ```bash
   npm install --save-dev
   ```

4. **Verify installation**
   ```bash
   npm list
   ```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/library-management
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library-management

# JWT Configuration (generate a secure secret)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Library Management System <your-email@gmail.com>

# Security
BCRYPT_ROUNDS=12

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@library.com
ADMIN_PASSWORD=admin123
```

### Environment Variables Description

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Application environment | `development`, `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/library-management` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d`, `24h`, `30m` |
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Email account username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email account password/app password | `your-password` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the server in production mode |
| `npm run dev` | Runs the server in development mode with auto-restart |

## Database Setup

### MongoDB Collections

The application uses the following MongoDB collections:

1. **users** - User accounts (students and librarians)
2. **books** - Book inventory and metadata
3. **requests** - Book borrow/return requests

### Initial Setup

1. **Start MongoDB service**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux (systemd)
   sudo systemctl start mongod
   ```

2. **Create database and admin user**
   - The application will automatically create the database
   - Run the admin creation script if available:
   ```bash
   node create-admin.js
   ```

## Security Configuration

### Password Security
- Uses bcryptjs with configurable salt rounds (default: 12)
- Implements password strength validation

### JWT Authentication
- Secure token generation with configurable expiration
- Token verification middleware for protected routes

### CORS Configuration
- Configured to allow requests from frontend URL
- Supports credentials for authentication

### Data Validation
- Input validation using validator library
- Mongoose schema validation
- Custom middleware for request validation

## Email Configuration

### Gmail Setup (Example)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use App Password** in `EMAIL_PASS` environment variable

### Other Email Providers

The application supports any SMTP server. Common configurations:

| Provider | Host | Port | Security |
|----------|------|------|----------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |

## Scheduled Tasks

The application uses `node-cron` for scheduled tasks:

- **Due date reminders**: Sends email notifications for upcoming due dates
- **Overdue notifications**: Sends notifications for overdue books
- **System maintenance**: Cleanup tasks and data archiving

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile

### Book Routes (`/api/books`)
- `GET /` - Get all books
- `POST /` - Add new book (admin only)
- `PUT /:id` - Update book (admin only)
- `DELETE /:id` - Delete book (admin only)

### Request Routes (`/api/requests`)
- `GET /` - Get user requests
- `POST /` - Create borrow request
- `PUT /:id/approve` - Approve request (admin only)
- `PUT /:id/return` - Process return

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Admin dashboard data
- `GET /users` - Get all users
- `GET /overdue` - Get overdue books

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check MONGODB_URI in .env file
   - Ensure database permissions are correct

2. **JWT Token Issues**
   - Verify JWT_SECRET is set and secure
   - Check token expiration settings
   - Ensure frontend sends token in Authorization header

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall and network settings
   - Test with email provider's settings

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <process-id> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

5. **Dependencies Installation Fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## Performance Recommendations

- Use MongoDB indexes for frequently queried fields
- Implement connection pooling for MongoDB
- Use Redis for session storage in production
- Enable gzip compression
- Implement rate limiting for API endpoints
- Use clustering for multi-core systems

## Security Best Practices

- Keep dependencies updated
- Use HTTPS in production
- Implement input validation and sanitization
- Use environment variables for sensitive data
- Enable MongoDB authentication
- Implement proper error handling (don't expose sensitive info)
- Use security headers (helmet.js)
- Implement rate limiting and brute force protection

## Production Deployment

### Environment Setup
- Set `NODE_ENV=production`
- Use process manager (PM2, forever)
- Configure reverse proxy (Nginx, Apache)
- Set up SSL certificates
- Configure database backups
- Set up monitoring and logging

### Database Considerations
- Use MongoDB replica sets for high availability
- Implement regular backups
- Monitor database performance
- Set up proper indexes
- Configure authentication and authorization