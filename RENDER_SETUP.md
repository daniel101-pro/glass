# How to Add Google Analytics to Render

## Step-by-Step Guide

### 1. Go to Your Render Dashboard
1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service (the one running your Glass backend API)
3. Click on the service name to open its settings

### 2. Navigate to Environment Variables
1. In your service page, click on the **"Environment"** tab (in the left sidebar)
2. Or scroll down to the **"Environment Variables"** section

### 3. Add GA_PROPERTY_ID
1. Click **"Add Environment Variable"** or the **"+"** button
2. **Key**: `GA_PROPERTY_ID`
3. **Value**: `12952536444`
4. Click **"Save Changes"**

### 4. Add GA_SERVICE_ACCOUNT_KEY
1. Click **"Add Environment Variable"** again
2. **Key**: `GA_SERVICE_ACCOUNT_KEY`
3. **Value**: Paste your entire service account JSON as a single line
   - It should look like: `{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}`
4. Click **"Save Changes"**

### 5. Deploy
1. After adding both variables, Render will automatically trigger a new deployment
2. Wait for the deployment to complete
3. Check the logs to ensure there are no errors

## Important Notes

### For GA_SERVICE_ACCOUNT_KEY:
- **Keep it as a single line** - don't add line breaks
- The `\n` in the private key should stay as `\n` (don't convert to actual newlines)
- Make sure the entire JSON is in one continuous string
- If you have the JSON file, you can copy it and remove all line breaks, or use a JSON minifier

### Example Format:
```
GA_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"glass-analytics@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/glass-analytics%40your-project.iam.gserviceaccount.com"}
```

### Alternative: Using Render's Secret Files (For Large JSON)
If the JSON is too large or you're having issues:
1. In Render, go to **"Environment"** tab
2. Scroll to **"Secret Files"** section
3. Create a file named `ga-service-account.json`
4. Paste your JSON (with proper formatting/line breaks)
5. Update your backend code to read from the file instead (optional - current setup works with env var)

## Verification

After deployment:
1. Check the deployment logs for any errors
2. Look for: `✅ Google Analytics client initialized` (if successful)
3. Or: `⚠️  Google Analytics not configured` (if variables are missing)
4. Test the admin dashboard - it should show real visit data

## Troubleshooting

### If you see "Google Analytics not configured":
- Double-check that both environment variables are set
- Verify `GA_PROPERTY_ID` is exactly `12952536444` (no spaces)
- Verify `GA_SERVICE_ACCOUNT_KEY` is valid JSON (you can test it in a JSON validator)

### If you see authentication errors:
- Verify the service account email has Viewer access in Google Analytics
- Check that Analytics Data API is enabled in Google Cloud Console
- Verify the JSON is complete and properly formatted

### If the deployment fails:
- Check the build logs for syntax errors in the JSON
- Make sure there are no extra quotes or special characters
- Try copying the JSON again from your service account file

