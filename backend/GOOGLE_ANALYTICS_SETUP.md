# Google Analytics Setup Guide

## Overview

The dashboard now fetches real website visit data from Google Analytics 4. Follow these steps to connect your GA4 property.

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in:
   - Name: `glass-analytics`
   - Description: `Service account for Glass Analytics API`
6. Click **Create and Continue**
7. Skip role assignment (click **Continue**)
8. Click **Done**

## Step 2: Generate Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Download the JSON file
6. Copy the entire JSON content

## Step 3: Enable Analytics Data API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Analytics Data API"
3. Click on it and click **Enable**

## Step 4: Grant Access to GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon) in the bottom left
3. Under **Property**, click **Property access management**
4. Click **+** to add a user
5. Enter the service account email (from the JSON: `client_email`)
6. Select role: **Viewer**
7. Click **Add**

## Step 5: Get Your Property ID

1. In Google Analytics, go to **Admin**
2. Under **Property**, click **Data Streams**
3. Click on your stream (e.g., "Glass")
4. Copy the **Stream ID** (numeric, e.g., `12952536444`) - this is your Property ID
   - Note: This is different from the Measurement ID (G-XXXXXXXXXX)
   - The Stream ID is what you'll use for the API

## Step 6: Add Environment Variables

Add these to your `.env` file or deployment environment:

```bash
GA_PROPERTY_ID=12952536444  # Your GA4 Stream ID / Property ID (numeric)
GA_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Important:** 
- The `GA_SERVICE_ACCOUNT_KEY` must be the entire JSON as a single line string
- For Render/deployment, you may need to escape the JSON properly or use a different format
- The private key in the JSON contains newlines - keep them as `\n` in the string

## Step 7: Verify

1. Deploy your backend with the new environment variables
2. Login to the admin dashboard
3. The "Website Visits" chart should now show real data from Google Analytics

## Troubleshooting

### No data showing
- Verify `GA_PROPERTY_ID` is correct (numeric ID, not the G-XXXXXXXXXX Measurement ID)
- Check that the service account has Viewer access to the GA4 property
- Verify Analytics Data API is enabled in Google Cloud Console
- Check backend logs for any error messages

### Authentication errors
- Verify the service account JSON is correctly formatted
- Ensure the private key includes `\n` for newlines
- Check that the service account email matches what you added to GA4

## Alternative: Use Mock Data

If you don't want to set up Google Analytics right now, the dashboard will show zeros for visits/page views until GA is configured. The waitlist data will still work normally.

