import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - attach token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (refreshToken) {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    const { token } = response.data.data;
                    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed, logout user
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
