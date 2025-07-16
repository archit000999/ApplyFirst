# ApplyFirst Copilot Backend

Backend API for the ApplyFirst Copilot application built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration/login
- **Copilot Configuration Management**: Save and manage copilot setups with progressive data saving
- **Payment Processing**: Stripe integration for subscription management
- **Application Management**: Handle job application submissions
- **Step-by-step Data Persistence**: Save user progress at each step of the copilot setup

## Project Structure

```
backend/
├── src/
│   ├── models/           # Database models
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── app.js          # Main application file
├── .env                # Environment variables
├── .gitignore         # Git ignore rules
└── package.json       # Dependencies and scripts
```

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env` and update the values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/copilot-app
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# ... other variables
```

4. **Start the development server**
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Copilot Configuration
- `GET /api/copilot` - Get all user copilots
- `POST /api/copilot` - Create new copilot
- `GET /api/copilot/:id` - Get specific copilot
- `PUT /api/copilot/:id` - Update copilot
- `PUT /api/copilot/:id/step` - Update specific step
- `DELETE /api/copilot/:id` - Delete copilot

### Payments
- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `GET /api/payment/history` - Get payment history
- `POST /api/payment/cancel-subscription` - Cancel subscription

### Applications
- `POST /api/application` - Submit application (public)
- `GET /api/application` - Get user applications
- `GET /api/application/:id` - Get specific application
- `PUT /api/application/:id/status` - Update application status
- `DELETE /api/application/:id` - Delete application

## Database Models

### User
- Authentication and profile information
- Subscription status and plan details
- Payment customer ID

### CopilotConfig
- Complete copilot configuration
- Step-by-step progress tracking
- Job setup, filters, screening data, and final config

### Payment
- Stripe payment records
- Subscription details
- Billing history

### Application
- Job application submissions
- User and copilot associations
- Application status tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

## Development

**Start development server with auto-reload:**
```bash
npm run dev
```

**Start production server:**
```bash
npm start
```

## Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `PORT` - Server port (default: 5000)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Security headers
- Input validation
- Error handling without exposing sensitive information

## License

MIT License
