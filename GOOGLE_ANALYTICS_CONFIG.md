# Google Analytics Configuration

## Current Setup

✅ **Google Analytics is configured for your Glass website**

### Frontend Tracking (Already Set Up)
- **Measurement ID**: `G-5P0MHQNZVZ`
- **Status**: ✅ Active in `index.html`
- **Tracks**: All page views and events automatically

### Backend API Integration (To Enable Real Dashboard Data)

To show real website visit data in the admin dashboard, you need to:

1. **Set up Google Cloud Service Account** (see `backend/GOOGLE_ANALYTICS_SETUP.md`)
2. **Add these environment variables to your backend**:

```bash
# Your GA4 Stream ID (Property ID)
GA_PROPERTY_ID=12952536444

# Service Account JSON (from Google Cloud Console)
GA_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

## Stream Details

- **Stream Name**: Glass
- **Stream URL**: https://glass.ink
- **Stream ID**: 12952536444 (use this for `GA_PROPERTY_ID`)
- **Measurement ID**: G-5P0MHQNZVZ (already in frontend)

## Current Status

- ✅ Frontend tracking: Active and collecting data
- ⏳ Backend API: Needs service account setup to show data in dashboard
- ✅ Dashboard: Ready to display real data once backend is configured

## Next Steps

1. Follow the setup guide in `backend/GOOGLE_ANALYTICS_SETUP.md`
2. Add the environment variables to your Render backend
3. The dashboard will automatically start showing real visit data

