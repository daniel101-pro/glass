# Deployment Guide for Glass Backend

## Quick Setup (5 minutes)

### 1. Set up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free account
2. Create a new cluster (free tier)
3. Create a database user:
   - Username: `glass-user`
   - Password: Generate a secure password
4. Add IP address `0.0.0.0/0` to allow connections from anywhere
5. Get your connection string - it looks like:
   ```
   mongodb+srv://glass-user:<password>@cluster0.xxxxx.mongodb.net/glass?retryWrites=true&w=majority
   ```

### 2. Deploy to Render (Free)

1. Go to [Render](https://render.com/) and create an account
2. Connect your GitHub account and fork/push this repository
3. Create a new Web Service:
   - **Repository**: Your glass repository
   - **Branch**: main
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

4. Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string-from-step-1>
   JWT_SECRET=<generate-a-random-32-character-string>
   JWT_EXPIRES_IN=24h
   BCRYPT_ROUNDS=10
   CORS_ORIGIN=*
   ```

5. Deploy! Your backend will be available at: `https://your-app-name.onrender.com`

### 3. Update Frontend

Update your frontend's environment variable:

**For local development**, create `.env.local` in the `landing-webapp` folder:
```
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com/api/v1
```

**For production deployment** (Vercel/Netlify), add this environment variable to your hosting platform.

### 4. Test Your Deployment

Test your API endpoints:
```bash
# Health check
curl https://your-app-name.onrender.com/api/v1/health

# Test signup
curl -X POST https://your-app-name.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User","password":"password123","confirmPassword":"password123"}'
```

## Alternative: One-Click Deploy

You can also use the `render.yaml` file in the root directory for one-click deployment:

1. Fork this repository to your GitHub
2. Go to Render Dashboard
3. Click "New" → "Blueprint"
4. Connect your repository
5. Set the MongoDB URI environment variable manually

That's it! Your backend is now live and connected to MongoDB Atlas.

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Can't connect to MongoDB**: Verify your connection string and IP whitelist
- **CORS errors**: Update the `CORS_ORIGIN` environment variable to match your frontend domain
- **Server won't start**: Check the logs in Render dashboard for error messages

