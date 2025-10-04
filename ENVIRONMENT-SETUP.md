# 🔧 Environment Variables Setup

You need to set these environment variables in your Netlify dashboard:

## 📍 Go to Netlify Dashboard:
1. Visit: https://app.netlify.com/sites/gantyadarohith-library/settings/deploys#environment-variables
2. Click "Add new variable" for each of these:

## 🔑 Required Environment Variables:

### 1. MONGO_URI
```
Name: MONGO_URI
Value: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/library?retryWrites=true&w=majority
```
**⚠️ IMPORTANT**: Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas details.

If you don't have MongoDB Atlas set up:
1. Go to: https://cloud.mongodb.com/
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace localhost connection with Atlas connection

### 2. JWT_SECRET
```
Name: JWT_SECRET
Value: library_management_jwt_secret_key_2024
```

### 3. NODE_ENV
```
Name: NODE_ENV
Value: production
```

## 🚀 After Setting Variables:
1. Go to: https://app.netlify.com/sites/gantyadarohith-library/deploys
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete
4. Test your site: https://gantyadarohith-library.netlify.app

## 📝 Optional Email Variables (for notifications):
```
EMAIL_USER: rohithjinwoo@gmail.com
EMAIL_PASS: mlgc bmyf srst oqoq
EMAIL_ENABLED: true
LOAN_DAYS: 15
```

## ❗ Common Issues:
- **MongoDB Connection**: Make sure to whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- **JWT Secret**: Must match exactly what you used locally
- **Spelling**: Variable names are case-sensitive

---

**Next Steps**: Set these variables in Netlify, then redeploy!