import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('🔍 [Interceptor] Token:', token ? token.substring(0,30) + '...' : 'null');
        if (token) {
            config.headers.Authorization = Bearer PASTE_TOKEN_HERE;
            console.log('✅ [Interceptor] Authorization header set');
        } else {
            console.warn('⚠️ [Interceptor] No token');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('🔴 [Interceptor] Response error:', error.response?.status);
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('🔄 [Interceptor] Attempting token refresh...');
            try {
                const refresh = localStorage.getItem('refresh_token');
                if (refresh) {
                    const { data } = await axios.post(${API_BASE_URL}/token/refresh/, { refresh });
                    localStorage.setItem('access_token', data.access);
                    api.defaults.headers.common.Authorization = Bearer ;
                    console.log('✅ [Interceptor] Token refreshed');
                    return api(originalRequest);
                }
            } catch (e) {
                console.log('❌ [Interceptor] Refresh failed – will redirect to login');
                debugger;  // <-- PAUSE HERE before redirect
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
