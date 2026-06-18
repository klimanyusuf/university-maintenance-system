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
        console.log('🔍 Interceptor - Token from localStorage:', token ? token.substring(0, 30) + '...' : 'null');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
            console.log('✅ Added Authorization header:', config.headers.Authorization);
        } else {
            console.warn('⚠️ No token found in localStorage');
        }
        console.log('🔍 Request URL:', config.url);
        console.log('🔍 Request Headers:', config.headers);
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
); {
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

