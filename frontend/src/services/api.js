import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Simple interceptor – logs token, but no refresh logic
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('🔍 Interceptor – token:', token ? 'YES' : 'NO');
        if (token) {
            config.headers.Authorization = Bearer PASTE_TOKEN_HERE;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

