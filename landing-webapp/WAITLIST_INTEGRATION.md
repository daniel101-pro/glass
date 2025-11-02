# Waitlist Integration with Glass Backend

The waitlist functionality has been integrated with the existing Glass backend system.

## Backend Integration

The waitlist is now part of the Glass backend located at `/Users/admin/Documents/glass/backend/`.

### New Files Created

1. **Model**: `src/models/Waitlist.ts` - Mongoose schema for waitlist entries
2. **Store**: `src/stores/waitlistStore.ts` - Data access layer for waitlist operations
3. **Routes**: `src/routes/waitlist.ts` - API endpoints for waitlist
4. **Validation**: `src/validation/waitlist.ts` - Input validation for waitlist requests
5. **Types**: `src/types/waitlist.ts` - TypeScript types for waitlist

### API Endpoints

All endpoints are under `/api/v1/waitlist`:

- **POST** `/api/v1/waitlist` - Add email to waitlist (public)
- **GET** `/api/v1/waitlist` - Get all entries (admin only, requires auth token)
- **DELETE** `/api/v1/waitlist/:id` - Delete entry (admin only, requires auth token)
- **GET** `/api/v1/waitlist/export` - Export as CSV (admin only, requires auth token)

## Frontend Updates

### Waitlist Page (`clarity2/src/sections/WaitlistPage/WaitlistPage.tsx`)
- Updated to use `/api/v1/waitlist` endpoint
- API URL defaults to `http://localhost:4000`

### Admin Page (`clarity2/src/pages/AdminPage.tsx`)
- Updated to use JWT authentication from the Glass backend
- Login uses `/api/v1/auth/login` endpoint
- Requires email and password (create admin account via signup first)
- All admin endpoints require Bearer token authentication

## Setup Instructions

### 1. Backend Setup

Navigate to the Glass backend:
```bash
cd /Users/admin/Documents/glass/backend
```

Install dependencies:
```bash
npm install
```

Configure `.env` file (copy from `env.example`):
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

Start the backend:
```bash
npm run dev
```

### 2. Create Admin Account

Before accessing the admin page, create an admin account:

**Option 1: Via API**
```bash
curl -X POST http://localhost:4000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glass.app",
    "fullName": "Admin User",
    "password": "your-secure-password"
  }'
```

**Option 2: Via your frontend signup (if available)**

### 3. Frontend Setup

Navigate to the frontend:
```bash
cd /Users/admin/Documents/clarity2
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
VITE_ADMIN_EMAIL=admin@glass.app
```

Start the frontend:
```bash
npm run dev
```

## Usage

### Adding to Waitlist
1. Users can visit `/#waitlist`
2. Enter their email
3. Submit to join the waitlist

### Admin Access
1. Visit `/#admin`
2. Login with admin email and password
3. View all waitlist entries
4. Delete entries or export to CSV

## Database

Waitlist entries are stored in MongoDB in a `waitlists` collection. Each entry contains:
- `email` (unique, lowercase)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Security

- Public endpoints (POST /waitlist) are open to everyone
- Admin endpoints require JWT authentication
- Email validation is enforced
- Duplicate emails are prevented
- Passwords are hashed (for admin accounts)

## Notes

- The standalone `server.js` file has been removed from `clarity2`
- All waitlist functionality now uses the Glass backend
- Admin authentication uses the existing auth system
- MongoDB is required for the backend to function

