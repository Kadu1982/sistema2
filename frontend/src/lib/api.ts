import axios from 'axios';

const apiService = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT automaticamente
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta para capturar erro 401 e redirecionar
apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('operador');
            window.location.href = '/login'; // Redireciona para tela de login
        }
        return Promise.reject(error);
    }
);

export default apiService;