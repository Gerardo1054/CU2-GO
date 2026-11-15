import axios from 'axios';

export const API_BASE_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const ema = sessionStorage.getItem('docenteEMA');

        if (ema) {
            config.headers['X-Docente-EMA'] = ema;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const codigo = error.response?.status;

        if (
            codigo === 503 &&
            window.location.pathname !== '/servicio-no-disponible'
        ) {
            window.location.assign('/servicio-no-disponible');
        }

        if (
            (codigo === 502 || codigo === 504) &&
            window.location.pathname !== '/error-servidor'
        ) {
            window.location.assign(`/error-servidor?codigo=${codigo}`);
        }

        return Promise.reject(error);
    }
);

export default api;
