# Analytics "Failed to Fetch" Troubleshooting

## Quick Checks

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages:
- Look for CORS errors
- Check for 401 (Unauthorized) errors
- Look for network errors

### 2. Verify Backend is Running
1. Check if your backend is deployed on Render
2. Test the endpoint directly:
   ```
   https://glass-qpbx.onrender.com/api/v1/health
   ```
   Should return: `{"ok":true}`

### 3. Check Authentication
The analytics endpoint requires authentication. Make sure:
- You're logged into the admin dashboard
- Your auth token is valid
- Try logging out and logging back in

### 4. Test the Endpoint Manually

Open your browser console and run:
```javascript
const token = localStorage.getItem('auth_token');
fetch('https://glass-qpbx.onrender.com/api/v1/analytics/website-visits?days=30', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

This will show you the exact error.

## Common Issues & Solutions

### Issue 1: CORS Error
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**:
1. In Render, add/update `CORS_ORIGIN` environment variable:
   - Value: `https://glass.ink` (or your frontend domain)
2. Redeploy the backend

### Issue 2: 401 Unauthorized
**Error**: `401 Unauthorized` or `Authentication required`

**Solution**:
1. Log out of the admin dashboard
2. Log back in
3. The token should refresh

### Issue 3: 404 Not Found
**Error**: `404` or `Cannot GET /api/v1/analytics/website-visits`

**Solution**:
1. Check that the backend code is deployed
2. Verify the route is registered in `server.ts`
3. Check Render deployment logs for errors

### Issue 4: Network Error
**Error**: `Failed to fetch` or `NetworkError`

**Solution**:
1. Check if backend is running (test `/api/v1/health`)
2. Check Render service status
3. Verify the API URL is correct in the frontend

### Issue 5: Backend Returns Empty Data
**No Error, but charts show zeros**

This is **normal** if Google Analytics isn't configured yet. The endpoint will return empty data (zeros) until you:
1. Set up Google Cloud service account
2. Add `GA_PROPERTY_ID` and `GA_SERVICE_ACCOUNT_KEY` to Render
3. Redeploy backend

## Debugging Steps

### Step 1: Check Backend Logs
1. Go to Render Dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for:
   - `✅ Google Analytics client initialized` (if GA is configured)
   - `⚠️  Google Analytics not configured` (if not configured - this is OK)
   - Any error messages

### Step 2: Test Authentication
```javascript
// In browser console on admin page
const token = localStorage.getItem('auth_token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
```

### Step 3: Test Endpoint Directly
```bash
# Replace YOUR_TOKEN with actual token from localStorage
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://glass-qpbx.onrender.com/api/v1/analytics/website-visits?days=30
```

### Step 4: Check Network Tab
1. Open DevTools > Network tab
2. Filter by "analytics"
3. Click on the request
4. Check:
   - Request URL
   - Request Headers (Authorization should be present)
   - Response status
   - Response body

## Expected Behavior

### If GA is NOT configured:
- ✅ Endpoint returns: `{ success: true, data: [{date: "...", visits: 0, pageViews: 0}, ...] }`
- ✅ Charts show zeros (this is expected)
- ✅ No errors in console

### If GA IS configured:
- ✅ Endpoint returns real data from Google Analytics
- ✅ Charts show actual visit numbers
- ✅ Data updates when you change time range

## Still Having Issues?

1. **Check Render deployment**: Make sure latest code is deployed
2. **Check environment variables**: Verify they're set correctly in Render
3. **Check browser console**: Look for specific error messages
4. **Test with curl**: Use the curl command above to test directly
5. **Check backend logs**: Look for any server-side errors

## Quick Fix: Disable Analytics Temporarily

If you want to stop the "Failed to fetch" errors temporarily, you can comment out the analytics fetch in `AdminPage.tsx`:

```typescript
// Comment out this line in useEffect:
// fetchAnalytics();
```

The dashboard will still work, just without analytics data.

