import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
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
