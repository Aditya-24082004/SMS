import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <h2>Service Management System</h2>
                </Link>

                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role badge badge-primary">{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
