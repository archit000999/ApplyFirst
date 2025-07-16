# API Testing Guide

Your backend is now running on `http://localhost:5001`

## Test the API Endpoints

### 1. Health Check
```bash
curl http://localhost:5001/health
```

### 2. Register a new user
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Create a Copilot Config (requires JWT token from login)
```bash
curl -X POST http://localhost:5001/api/copilot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My First Copilot",
    "jobSetup": {
      "jobTitle": "Software Engineer",
      "locations": ["San Francisco", "Remote"],
      "workMode": "hybrid"
    }
  }'
```

### 5. Submit an Application (public endpoint)
```bash
curl -X POST http://localhost:5001/api/application \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phoneNumber": "+1234567890",
    "isInUS": "yes",
    "careerTrack": "software-engineering",
    "isCurrentlyEmployed": "yes"
  }'
```

### 6. Get User Profile (requires JWT token)
```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Integration

To connect your frontend to this backend, update your frontend API calls to point to:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';

// Example usage in your React app:
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

## Environment Setup

Make sure to:
1. Install MongoDB and have it running locally OR use the provided MongoDB Atlas connection
2. Set up Stripe account and add keys to `.env` for payment processing
3. Update CORS origins in `src/app.js` to include your frontend URL

## Next Steps

1. Test all endpoints using the curl commands above
2. Integrate with your React frontend
3. Set up Stripe for payment processing
4. Add file upload functionality for resumes
5. Implement email notifications
