import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Add token as query parameter
            const separator = config.url.includes('?') ? '&' : '?';
            config.url = config.url + separator + 'token=' + token;
            // Also add Authorization header
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export default api;
