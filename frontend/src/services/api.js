import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor: add token to EVERY request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // ALWAYS add token as query param (works around Hugging Face proxy)
            const separator = config.url.includes('?') ? '&' : '?';
            config.url = config.url + separator + 'token=' + token;
            // Also add Authorization header for standard compatibility
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
