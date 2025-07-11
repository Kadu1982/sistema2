import api from './apiService.ts'; // Importamos a instância centralizada que acabamos de criar.

// Estas interfaces definem a "forma" dos objetos de requisição e resposta de login.
// É uma boa prática tê-las para garantir a consistência do código.
export interface LoginRequest {
    login: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    // Você pode adicionar outros campos que sua API retorna, como dados do operador.
    operador: {
        id: number;
        nome: string;
        login: string;
    };
}

/**
 * Função para realizar o login.
 * @param credentials - Um objeto com 'login' e 'senha'.
 * @returns Os dados da resposta da API, incluindo o token.
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        // Envia as credenciais para o endpoint de login do backend.
        const response = await api.post<LoginResponse>('/auth/login', credentials);

        // Se a resposta da API contiver um token, nós o armazenamos no localStorage.
        // O localStorage é um armazenamento persistente no navegador.
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response.data;
    } catch (error) {
        // Se o login falhar, garantimos que qualquer token antigo seja removido.
        localStorage.removeItem('authToken');
        // Relançamos o erro para que a tela de login possa exibi-lo ao usuário.
        throw error;
    }
};

/**
 * Função para realizar o logout.
 * Apenas remove o token do armazenamento local. Sem o token, as futuras
 * requisições a endpoints protegidos falharão com erro 401 (Não Autorizado).
 */
export const logout = (): void => {
    localStorage.removeItem('authToken');
    // Opcional: Redireciona o usuário para a página de login após o logout.
    window.location.href = '/login';
};

/**
 * Função utilitária para verificar se há um token armazenado.
 * @returns 'true' se o token existir, 'false' caso contrário.
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};