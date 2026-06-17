import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

console.log('🔍 API_BASE_URL:', API_BASE_URL);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('🔍 [Interceptor] Token:', token ? 'YES' : 'NO');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ [Interceptor] Added Authorization header');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('🔍 [Response Interceptor] Error:', error.response?.status, error.response?.data);
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('🔄 [Response Interceptor] 401 received, attempting token refresh...');
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh_token');
                if (refresh) {
                    const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
                    localStorage.setItem('access_token', data.access);
                    api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                }
            } catch (e) {
                console.warn('❌ [Response Interceptor] Refresh failed, redirecting to login...');
                localStorage.clear();
                // Instead of immediate redirect, log and delay to see logs
                // We'll use a small timeout to allow logs to be seen
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return Promise.reject(error);
            }
        }
        console.log('❌ [Response Interceptor] Other error:', error.message);
        return Promise.reject(error);
    }
); => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh_token');
                if (refresh) {
                    const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
                    localStorage.setItem('access_token', data.access);
                    api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                }
            } catch (e) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

