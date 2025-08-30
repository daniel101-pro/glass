# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Glass application.

## 🚀 Quick Start

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select a Project**
   - Click "Select a project" → "New Project"
   - Name: "Glass App" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (for testing with any Google account)
   - Fill in required fields:
     - App name: `Glass`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "Save and Continue"
   - Skip "Scopes" → "Save and Continue"
   - Add test users (your email) → "Save and Continue"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Glass Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)
   - Click "Create"
   - **Copy the Client ID and Client Secret** 📋

### 2. Environment Setup

1. **Create `.env.local` file** in `/landing-webapp/`:
   ```env
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
   
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id-from-step-5
   GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-5
   
   # Backend API (keep existing)
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
   ```

2. **Generate NEXTAUTH_SECRET**:
   ```bash
   # Run this in terminal to generate a secure secret:
   openssl rand -base64 32
   ```

### 3. Test the Setup

1. **Start your frontend**:
   ```bash
   cd landing-webapp
   npm run dev
   ```

2. **Visit the app**:
   - Go to: http://localhost:3000/onboarding
   - Click "Continue with Google"
   - Should redirect to Google sign-in
   - After signing in, should redirect to dashboard

## 🔧 How It Works

### Authentication Flow
1. User clicks "Continue with Google" 
2. NextAuth.js redirects to Google OAuth
3. User signs in with Google account
4. Google redirects back with auth code
5. NextAuth.js exchanges code for user info
6. User is redirected to dashboard with session

### Session Management
- **Google Auth**: Managed by NextAuth.js sessions
- **Traditional Auth**: JWT tokens in localStorage
- **Dashboard**: Handles both auth methods seamlessly

### UI Integration
- **Onboarding**: Shows both Google and email signup options
- **Dashboard**: Auto-detects auth method for sign out
- **Routing**: Protected routes check both auth methods

## 🚨 Troubleshooting

### Common Issues

1. **"OAuth Error: redirect_uri_mismatch"**
   - Check authorized redirect URIs in Google Console
   - Must match exactly: `http://localhost:3000/api/auth/callback/google`

2. **"Invalid client: no application name"**
   - Complete OAuth consent screen configuration
   - Add app name and required contact information

3. **"Access blocked: This app's request is invalid"**
   - Enable Google+ API in Google Cloud Console
   - Verify OAuth consent screen is configured

4. **Environment variables not working**
   - File must be named `.env.local` (not `.env`)
   - Restart Next.js development server after changes
   - Check for typos in variable names

5. **"NEXTAUTH_URL missing" error**
   - Add `NEXTAUTH_URL=http://localhost:3000` to `.env.local`
   - For production, use your actual domain

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Google Console credentials
4. Check Next.js server logs

## 🌐 Production Deployment

### Frontend (Vercel/Netlify)
```env
NEXTAUTH_URL=https://your-app-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=same-as-development
GOOGLE_CLIENT_SECRET=same-as-development
```

### Google Console Updates
- Add production redirect URI:
  `https://your-app-domain.com/api/auth/callback/google`
- Update OAuth consent screen with production URLs
- Remove "Testing" mode once ready for public use

## 📱 Features Enabled

✅ **One-click Google Sign In**  
✅ **Automatic account creation**  
✅ **Secure session management**  
✅ **Dashboard protection**  
✅ **Seamless sign out**  
✅ **Email & traditional auth fallback**  

## 🔗 Useful Links

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

🎯 **Your Google Auth is now ready!** Users can sign in with Google and be automatically redirected to the dashboard.
