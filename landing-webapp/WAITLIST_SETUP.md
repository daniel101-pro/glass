# Waitlist Setup Guide

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev:all
```
This runs both the frontend (Vite) and backend (Express) server simultaneously.

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## Configuration

1. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001
VITE_ADMIN_PASSWORD=your-secure-password-here
PORT=3001
```

2. Change the admin password from the default `admin123` to something secure!

## Access Points

- **Frontend**: http://localhost:5173 (or the port Vite assigns)
- **Waitlist Page**: http://localhost:5173/#waitlist
- **Admin Page**: http://localhost:5173/#admin
- **API Server**: http://localhost:3001

## API Endpoints

- `POST /api/waitlist` - Submit email to waitlist
- `GET /api/waitlist` - Get all waitlist entries (admin only)
- `DELETE /api/waitlist/:id` - Delete a waitlist entry (admin only)
- `GET /api/waitlist/export` - Export waitlist as CSV (admin only)
- `GET /api/health` - Health check

## Data Storage

Waitlist entries are stored in `waitlist.json` in the project root. This file is automatically created when the server starts.

**⚠️ Important**: The `waitlist.json` file is in `.gitignore` and won't be committed to git. Make sure to back it up regularly!

## Admin Features

- View all waitlist submissions with timestamps
- Delete individual entries
- Export to CSV
- Refresh to get latest submissions
- Password-protected (set via `VITE_ADMIN_PASSWORD`)

## Production Deployment

For production, you'll need to:

1. Set environment variables on your hosting platform
2. Ensure the backend server is running and accessible
3. Update `VITE_API_URL` to your production API URL
4. Use a proper authentication system instead of simple password (recommended)
5. Consider using a database instead of JSON file for better scalability

## Security Notes

- The current admin authentication is basic - consider upgrading for production
- The waitlist.json file stores emails in plain text
- For production, consider:
  - Proper database (PostgreSQL, MongoDB, etc.)
  - JWT or session-based authentication
  - Rate limiting on API endpoints
  - Email validation service integration
  - SSL/HTTPS encryption


