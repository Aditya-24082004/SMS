import api from './api';

const userService = {
    // Get all users (Admin only)
    getAllUsers: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get user by ID
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Update user (Admin only)
    updateUser: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    // Delete user (Admin only)
    deleteUser: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    // Get users by role (Admin only)
    getUsersByRole: async (role) => {
        const response = await api.get(`/users/role/${role}`);
        return response.data;
    }
};

export default userService;
