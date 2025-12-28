import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    }
};

export default authService;
