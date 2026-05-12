# Frontend Requirements

## System Requirements

- **Node.js**: Version 16.0.0 or higher (recommended: 18.x or 20.x)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Dependencies

### Production Dependencies

These packages are required for the application to run in production:

| Package | Version | Description |
|---------|---------|-------------|
| `axios` | ^1.6.0 | HTTP client for making API requests |
| `react` | ^18.2.0 | Core React library for building user interfaces |
| `react-dom` | ^18.2.0 | DOM-specific methods for React |
| `react-scripts` | ^5.0.1 | Configuration and scripts for Create React App |

### Development Dependencies

No additional development dependencies are currently specified. The `react-scripts` package provides all necessary development tools including:

- Webpack bundler
- Babel transpiler
- ESLint linter
- Jest test runner
- Development server

## Installation Instructions

### Prerequisites

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

### Setup Steps

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode on http://localhost:3000 |
| `npm run build` | Builds the app for production to the `build` folder |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run eject` | **One-way operation** - removes Create React App abstraction |

## Browser Compatibility

### Production Build
- Browsers with >0.2% market share
- Modern browsers (not Internet Explorer)
- Excludes Opera Mini

### Development Build
- Latest Chrome version
- Latest Firefox version
- Latest Safari version

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Optional: For production builds
GENERATE_SOURCEMAP=false
```

## Build Output

The production build will be created in the `build` folder with:
- Optimized and minified JavaScript and CSS
- Static assets with hashed filenames for caching
- Service worker for offline functionality (if configured)

## Troubleshooting

### Common Issues

1. **Node version mismatch**
   - Ensure Node.js version is 16.0.0 or higher
   - Use `nvm` (Node Version Manager) to manage Node versions

2. **npm install fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then reinstall

3. **Port 3000 already in use**
   - Kill process using port 3000 or set custom port:
   ```bash
   set PORT=3001 && npm start  # Windows
   PORT=3001 npm start         # macOS/Linux
   ```

4. **Build fails**
   - Check for TypeScript errors (if using TypeScript)
   - Ensure all environment variables are set correctly
   - Verify all imports are correct and files exist

## Performance Recommendations

- Use React DevTools for debugging and profiling
- Implement code splitting for large applications
- Use React.memo() for expensive components
- Consider implementing service workers for caching

## Security Notes

- Never commit sensitive environment variables to version control
- Use HTTPS in production
- Implement proper Content Security Policy (CSP) headers
- Regularly update dependencies to patch security vulnerabilities