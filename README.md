# Service Management System (SMS)

A full-stack MERN application for managing maintenance and service requests in office buildings.

## 📋 Overview

The Service Management System enables employees to report issues, administrators to assign tasks, and technicians to resolve and update service requests efficiently.

## 🚀 Features

- **Role-Based Access Control**: Employee, Admin, and Technician roles
- **Issue Management**: Create, track, and resolve service requests
- **Task Assignment**: Admins can assign issues to technicians
- **Status Tracking**: Real-time updates on issue progress
- **User Management**: Admin dashboard for user administration
- **Secure Authentication**: JWT-based authentication with refresh tokens

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS3 (Custom Design System)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator

## 📦 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd SMS_PROJECT
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Configure environment variables:**
- Edit `backend/.env.dev`
- Add your MongoDB Atlas URI
- Update JWT secrets (use strong random strings)

```env
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

**Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

**Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
SMS_PROJECT/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & role check middleware
│   │   ├── validators/      # Input validation
│   │   └── server.js        # Entry point
│   ├── .env.dev             # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # Auth context
    │   ├── services/        # API services
    │   ├── styles/          # CSS files
    │   ├── utils/           # Utilities & constants
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── .env.dev             # Environment variables
    └── package.json
```

## 🔑 Default Users

After setting up, you can register users with different roles:
- **Employee**: Can create and track their own issues
- **Admin**: Can manage users and assign issues
- **Technician**: Can view assigned issues and update status

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/role/:role` - Get users by role

### Issues
- `POST /api/issues` - Create issue
- `GET /api/issues` - Get all issues (filtered by role)
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue (Admin)
- `PUT /api/issues/:id/assign` - Assign to technician (Admin)
- `PUT /api/issues/:id/status` - Update status (Technician)
- `POST /api/issues/:id/comments` - Add comment

## 🎨 Design System

The application uses a modern design system with:
- Custom CSS variables for consistent theming
- Responsive grid and flexbox layouts
- Smooth transitions and animations
- Professional color palette
- Inter font family

## 🔒 Security Features

- Password hashing with bcrypt
- JWT access and refresh tokens
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet.js

## 📝 License

ISC

## 👥 Contributors

Your team members here

## 📧 Support

For support, email your-email@example.com
