# Admin Dashboard Setup Guide

## Overview

The admin dashboard now includes:
- **Analytics Dashboard** with charts and graphs
- **Waitlist Management** with full CRUD operations
- **Statistics Cards** showing key metrics
- **Time Range Filters** (7d, 30d, 90d, All Time)
- **Google Analytics Integration** (ready to connect)

## Features

### 📊 Statistics Cards
- Total Waitlist Signups
- New Signups (Last 7 Days)
- Website Visits (estimated)
- Conversion Rate

### 📈 Charts & Graphs
1. **Website Visits Chart** - Area chart showing daily traffic
2. **Daily Signups Chart** - Bar chart showing waitlist growth
3. **Analytics Overview** - Combined line chart with visits, page views, and signups

### 📋 Waitlist Management
- View all entries
- Delete entries
- Export to CSV
- Real-time refresh

## Google Analytics Setup

### Step 1: Get Your GA4 Measurement ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a GA4 property (if you haven't already)
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Add to Environment Variables
Add to your `.env` file or deployment environment:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Update index.html
Replace `G-XXXXXXXXXX` in `index.html` with your actual Measurement ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### Step 4: Connect Real Analytics Data (Optional)

To show real Google Analytics data in the dashboard:

1. **Set up Google Analytics Reporting API**
   - Enable Google Analytics Reporting API in Google Cloud Console
   - Create service account credentials
   - Add service account email to GA4 property with Viewer permissions

2. **Create Backend Endpoint**
   - Add endpoint: `GET /api/v1/analytics`
   - Fetch data from Google Analytics API
   - Return formatted data for charts

3. **Update AdminPage.tsx**
   - Replace mock data with API calls to `/api/v1/analytics`
   - Use the fetched data in charts

## Current Implementation

Currently, the dashboard shows:
- **Real data** for waitlist signups (from your database)
- **Mock data** for website visits and page views (placeholder for GA data)

The charts are fully functional and will automatically update when you connect real Google Analytics data.

## Access

Visit: `https://www.glass.ink/#admin`

Login with your admin credentials to access the dashboard.

