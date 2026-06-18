import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // ALWAYS add token as query parameter
            if (config.url.includes('?')) {
                config.url += `&token=${token}`;
            } else {
                config.url += `?token=${token}`;
            }
            // Also keep Authorization header as fallback
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
); => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Add token as query parameter (workaround for Hugging Face proxy)
            if (config.url.includes('?')) {
                config.url += `&token=${token}`;
            } else {
                config.url += `?token=${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

