# Service Management System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

## Step 1: MongoDB Atlas Setup

### 1.1 Create a MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a new account
3. Click "Build a Database"
4. Choose the **FREE** tier (M0 Sandbox)
5. Select your preferred cloud provider and region
6. Click "Create Cluster"

### 1.2 Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and secure password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add database name after `.net/`: `service_management_system`

Final URI example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/service_management_system?retryWrites=true&w=majority
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd C:\Users\Admin\Desktop\SMS_PROJECT\backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- helmet
- morgan
- nodemon (dev dependency)

### 2.3 Configure Environment Variables

1. Open `backend/.env.dev` in a text editor
2. Update the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_uri_here

# JWT Configuration (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long
JWT_REFRESH_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
```

**Generate Secure JWT Secrets:**
You can use Node.js to generate random strings:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000 in development mode
```

The backend API is now running at `http://localhost:5000`

## Step 3: Frontend Setup

### 3.1 Open New Terminal

Keep the backend terminal running and open a new terminal window.

### 3.2 Navigate to Frontend Directory

```bash
cd C:\Users\Admin\Desktop\SMS_PROJECT\frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite
- @vitejs/plugin-react

### 3.4 Verify Environment Variables

The `frontend/.env.dev` file should already contain:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3.5 Start the Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

The frontend application will automatically open in your browser at `http://localhost:5173`

## Step 4: Test the Application

### 4.1 Register a New User

1. The app will redirect you to the login page
2. Click "Register here"
3. Fill in the registration form:
   - Full Name: John Doe
   - Email: admin@example.com
   - Password: password123
   - Role: Admin
   - Department: IT
   - Phone: 1234567890
4. Click "Register"

### 4.2 Login

After registration, you'll be automatically logged in and redirected to the appropriate dashboard based on your role.

### 4.3 Create Test Users

Create users with different roles to test the system:

**Employee:**
- Email: employee@example.com
- Role: Employee

**Technician:**
- Email: technician@example.com
- Role: Technician

## Troubleshooting

### Backend Issues

**Problem: "MongoDB connection error"**
- Solution: Verify your MongoDB URI is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

**Problem: "Port 5000 already in use"**
- Solution: Change PORT in `.env.dev` to another port (e.g., 5001)
- Update `VITE_API_BASE_URL` in frontend `.env.dev` accordingly

**Problem: "Module not found"**
- Solution: Run `npm install` again in the backend directory

### Frontend Issues

**Problem: "Failed to fetch" or network errors**
- Solution: Ensure backend is running on port 5000
- Check that `VITE_API_BASE_URL` in `.env.dev` is correct
- Verify CORS settings in backend

**Problem: "Port 5173 already in use"**
- Solution: Kill the process using port 5173 or change port in `vite.config.js`

**Problem: "Module not found"**
- Solution: Run `npm install` again in the frontend directory

## Next Steps

Now that your application is running, you can:

1. **Create Issues** (as Employee)
   - Navigate to Employee dashboard
   - Create service requests

2. **Manage Users** (as Admin)
   - View all users
   - Assign issues to technicians

3. **Update Issues** (as Technician)
   - View assigned issues
   - Update status and add resolution notes

## Development Workflow

### Running Both Servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Making Changes

- **Backend changes**: Server auto-restarts with nodemon
- **Frontend changes**: Vite hot-reloads automatically

## Production Deployment

For production deployment:

1. **Backend**:
   - Create `.env.prod` with production values
   - Use `npm start` instead of `npm run dev`
   - Deploy to services like Heroku, Railway, or AWS

2. **Frontend**:
   - Run `npm run build` to create production build
   - Deploy `dist` folder to Netlify, Vercel, or similar

3. **Database**:
   - Keep using MongoDB Atlas (already cloud-hosted)
   - Restrict network access to production server IPs only

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure both backend and frontend servers are running
4. Check MongoDB Atlas connection status

Happy coding! 🚀
