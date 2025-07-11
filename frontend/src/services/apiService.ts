import axios from 'axios';

// Cria uma instância do Axios com configurações centralizadas
const apiService = axios.create({
    baseURL: 'http://localhost:8080', // ✅ URL COMPLETA DO BACKEND
    timeout: 30000, // Timeout aumentado para 30 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// ✅ INTERCEPTADOR DE REQUEST - PRESERVADO E MELHORADO
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Token adicionado:', token.substring(0, 20) + '...');
        }

        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.data && config.method !== 'get') {
            console.log('📦 Dados enviados:', config.data);
        }

        return config;
    },
    (error) => {
        console.error('❌ Erro no request interceptor:', error);
        return Promise.reject(error);
    }
);

// ✅ INTERCEPTADOR DE RESPONSE - PRESERVADO E MELHORADO
apiService.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('📦 Dados recebidos:', response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data, config } = error.response;
            console.error(`🚨 Erro ${status} em ${config?.method?.toUpperCase()} ${config?.url}:`, data);

            // Tratamento específico de erros - SEM REDIRECIONAMENTO AUTOMÁTICO
            if (status === 401) {
                console.error('🔐 Token inválido ou expirado');
                // Apenas log - não redireciona automaticamente
            } else if (status === 403) {
                console.error('🚫 Acesso negado');
            } else if (status === 404) {
                console.error('🔍 Recurso não encontrado');
            } else if (status >= 500) {
                console.error('💥 Erro interno do servidor');
            }
        } else if (error.request) {
            console.error('🌐 Erro de rede - Servidor não respondeu:', error.request);
            console.error('🔧 Verifique se o backend está rodando em http://localhost:8080');
        } else {
            console.error('❓ Erro desconhecido:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiService;