import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import { USER_ROLES } from './utils/constants';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard components
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import TechnicianDashboard from './components/dashboards/TechnicianDashboard';

// Import styles
import './styles/index.css';


const Unauthorized = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
    </div>
);

const HomePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to appropriate dashboard based on role
    if (user.role === USER_ROLES.ADMIN) {
        return <Navigate to="/admin" replace />;
    } else if (user.role === USER_ROLES.TECHNICIAN) {
        return <Navigate to="/technician" replace />;
    } else {
        return <Navigate to="/employee" replace />;
    }
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/technician"
                        element={
                            <ProtectedRoute allowedRoles={[USER_ROLES.TECHNICIAN]}>
                                <TechnicianDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
