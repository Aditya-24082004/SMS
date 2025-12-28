import React, { createContext, useState, useContext, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { user: userData, token: authToken, refreshToken } = response.data;

            // Store in state
            setUser(userData);
            setToken(authToken);

            // Store in localStorage
            localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const { user: newUser, token: authToken, refreshToken } = response.data;

            // Store in state
            setUser(newUser);
            setToken(authToken);

            // Store in localStorage
            localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

            return { success: true, user: newUser };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state
            setUser(null);
            setToken(null);

            // Clear localStorage
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
