import {
    Paciente,
    CriarPacienteRequest,
    AtualizarPacienteRequest,
    PacienteBuscaResponse
} from '@/types/Paciente';
import apiService from './apiService';

// Define PacienteInput type to match CadastroPacienteFormDataType
export type PacienteInput = {
    nomeCompleto: string;
    nomeSocial?: string;
    cpf?: string;
    justificativaAusenciaCpf?: string;
    cns?: string;
    sexo?: string;
    dataNascimento?: string;
    acamado?: boolean;
    domiciliado?: boolean;
    condSaudeMental?: boolean;
    usaPlantas?: boolean;
    outrasCondicoes?: string;
    municipio?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
    telefoneCelular?: string;
    telefoneContato?: string;
    tipoSanguineo?: string;
    cbo?: string;
    rg?: string;
    orgaoEmissor?: string;
    certidaoNascimento?: string;
    carteiraTrabalho?: string;
    tituloEleitor?: string;
    prontuarioFamiliar?: string;
    corRaca?: string;
    etnia?: string;
    escolaridade?: string;
    situacaoFamiliar?: string;
};

// ✅ TIPO PARA RESPOSTA SIMPLES DA API
interface PacienteApiResponse {
    success: boolean;
    message?: string;
    data?: Paciente | Paciente[];
    total?: number;
    pagina?: number;
    totalPaginas?: number;
}

export class PacienteService {
    private readonly baseUrl = '/api/pacientes';

    /**
     * Buscar paciente por ID
     */
    async buscarPorId(id: number): Promise<Paciente | null> {
        try {
            console.log(`🔍 PacienteService: Buscando paciente por ID: ${id}`);

            const response = await apiService.get<PacienteApiResponse>(`${this.baseUrl}/${id}`);

            if (response.data.success && response.data.data) {
                const paciente = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                console.log(`✅ Paciente encontrado:`, paciente.nome);
                return paciente;
            }

            console.log(`⚠️ Paciente não encontrado para ID: ${id}`);
            return null;

        } catch (error: any) {
            console.error(`❌ Erro ao buscar paciente por ID ${id}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Erro ao buscar paciente');
        }
    }

    /**
     * Buscar pacientes por nome
     */
    async buscarPorNome(nome: string): Promise<Paciente[]> {
        try {
            console.log(`🔍 PacienteService: Buscando pacientes por nome: ${nome}`);

            const response = await apiService.get<PacienteApiResponse>(
                `${this.baseUrl}/buscar?nome=${encodeURIComponent(nome)}`
            );

            if (response.data.success) {
                const pacientes = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                console.log(`✅ Encontrados ${pacientes.length} paciente(s) com nome: ${nome}`);
                // ✅ CORREÇÃO: Tipagem explícita do parâmetro
                return pacientes.filter((p: Paciente | null | undefined): p is Paciente => p != null);
            }

            console.log(`⚠️ Nenhum paciente encontrado para nome: ${nome}`);
            return [];

        } catch (error: any) {
            console.error(`❌ Erro ao buscar pacientes por nome ${nome}:`, error);
            return [];
        }
    }

    /**
     * Buscar paciente por CPF
     */
    async buscarPorCpf(cpf: string): Promise<Paciente | null> {
        try {
            console.log(`🔍 PacienteService: Buscando paciente por CPF: ${cpf}`);

            const response = await apiService.get<PacienteApiResponse>(
                `${this.baseUrl}/buscar?cpf=${encodeURIComponent(cpf)}`
            );

            if (response.data.success && response.data.data) {
                const paciente = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                console.log(`✅ Paciente encontrado por CPF:`, paciente.nome);
                return paciente;
            }

            console.log(`⚠️ Paciente não encontrado para CPF: ${cpf}`);
            return null;

        } catch (error: any) {
            console.error(`❌ Erro ao buscar paciente por CPF ${cpf}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Erro ao buscar paciente');
        }
    }

    /**
     * Buscar paciente por Cartão SUS
     */
    async buscarPorCartaoSus(cartaoSus: string): Promise<Paciente | null> {
        try {
            console.log(`🔍 PacienteService: Buscando paciente por Cartão SUS: ${cartaoSus}`);

            const response = await apiService.get<PacienteApiResponse>(
                `${this.baseUrl}/buscar?cartaoSus=${encodeURIComponent(cartaoSus)}`
            );

            if (response.data.success && response.data.data) {
                const paciente = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                console.log(`✅ Paciente encontrado por Cartão SUS:`, paciente.nome);
                return paciente;
            }

            console.log(`⚠️ Paciente não encontrado para Cartão SUS: ${cartaoSus}`);
            return null;

        } catch (error: any) {
            console.error(`❌ Erro ao buscar paciente por Cartão SUS ${cartaoSus}:`, error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Erro ao buscar paciente');
        }
    }

    /**
     * Listar todos os pacientes
     */
    async listarTodos(): Promise<Paciente[]> {
        try {
            console.log('📋 PacienteService: Listando todos os pacientes');

            const response = await apiService.get<PacienteApiResponse>(`${this.baseUrl}`);

            if (response.data.success) {
                const pacientes = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                console.log(`✅ Carregados ${pacientes.length} paciente(s)`);
                // ✅ CORREÇÃO: Tipagem explícita do parâmetro
                return pacientes.filter((p: Paciente | null | undefined): p is Paciente => p != null);
            }

            console.log('⚠️ Nenhum paciente encontrado');
            return [];

        } catch (error: any) {
            console.error('❌ Erro ao listar pacientes:', error);
            return [];
        }
    }

    /**
     * Criar novo paciente
     */
    async criar(dados: CriarPacienteRequest): Promise<Paciente> {
        try {
            console.log('💾 PacienteService: Criando novo paciente:', dados.nome);

            const response = await apiService.post<PacienteApiResponse>(`${this.baseUrl}`, dados);

            if (response.data.success && response.data.data) {
                const paciente = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                console.log(`✅ Paciente criado com sucesso, ID: ${paciente.id}`);
                return paciente;
            }

            throw new Error(response.data.message || 'Erro ao criar paciente');

        } catch (error: any) {
            console.error('❌ Erro ao criar paciente:', error);

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error('Erro interno ao criar paciente');
        }
    }

    /**
     * Atualizar paciente
     */
    async atualizar(dados: AtualizarPacienteRequest): Promise<Paciente> {
        try {
            console.log(`🔄 PacienteService: Atualizando paciente ID: ${dados.id}`);

            const response = await apiService.put<PacienteApiResponse>(`${this.baseUrl}/${dados.id}`, dados);

            if (response.data.success && response.data.data) {
                const paciente = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                console.log(`✅ Paciente atualizado com sucesso`);
                return paciente;
            }

            throw new Error(response.data.message || 'Erro ao atualizar paciente');

        } catch (error: any) {
            console.error(`❌ Erro ao atualizar paciente ID ${dados.id}:`, error);

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error('Erro interno ao atualizar paciente');
        }
    }

    /**
     * Excluir paciente
     */
    async excluir(id: number): Promise<void> {
        try {
            console.log(`🗑️ PacienteService: Excluindo paciente ID: ${id}`);

            const response = await apiService.delete<PacienteApiResponse>(`${this.baseUrl}/${id}`);

            if (response.data.success) {
                console.log(`✅ Paciente excluído com sucesso`);
                return;
            }

            throw new Error(response.data.message || 'Erro ao excluir paciente');

        } catch (error: any) {
            console.error(`❌ Erro ao excluir paciente ID ${id}:`, error);

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error('Erro interno ao excluir paciente');
        }
    }

    /**
     * Busca avançada com filtros
     */
    async buscarAvancado(filtros: {
        nome?: string;
        cpf?: string;
        cartaoSus?: string;
        ativo?: boolean;
        pagina?: number;
        limite?: number;
    }): Promise<PacienteBuscaResponse> {
        try {
            console.log('🔍 PacienteService: Busca avançada com filtros:', filtros);

            const params = new URLSearchParams();

            if (filtros.nome) params.append('nome', filtros.nome);
            if (filtros.cpf) params.append('cpf', filtros.cpf);
            if (filtros.cartaoSus) params.append('cartaoSus', filtros.cartaoSus);
            if (filtros.ativo !== undefined) params.append('ativo', String(filtros.ativo));
            if (filtros.pagina) params.append('pagina', String(filtros.pagina));
            if (filtros.limite) params.append('limite', String(filtros.limite));

            const response = await apiService.get<PacienteApiResponse>(
                `${this.baseUrl}/buscar?${params.toString()}`
            );

            if (response.data.success) {
                const pacientes = Array.isArray(response.data.data) ? response.data.data : [response.data.data];

                console.log(`✅ Busca avançada: ${pacientes.length} paciente(s) encontrado(s)`);

                return {
                    // ✅ CORREÇÃO: Tipagem explícita do parâmetro
                    pacientes: pacientes.filter((p: Paciente | null | undefined): p is Paciente => p != null),
                    total: response.data.total || pacientes.length,
                    pagina: response.data.pagina || 1,
                    totalPaginas: response.data.totalPaginas || 1
                };
            }

            return {
                pacientes: [],
                total: 0,
                pagina: 1,
                totalPaginas: 1
            };

        } catch (error: any) {
            console.error('❌ Erro na busca avançada:', error);

            return {
                pacientes: [],
                total: 0,
                pagina: 1,
                totalPaginas: 1
            };
        }
    }
}

// ✅ CRIAÇÃO DA INSTÂNCIA DO SERVIÇO
const pacienteService = new PacienteService();

// ✅ EXPORTAÇÕES - COMPATIBILIDADE COM CÓDIGO EXISTENTE
export default pacienteService;

// ✅ FUNÇÕES LEGADAS - Para compatibilidade com código existente
export const getAllPacientes = (): Promise<Paciente[]> => pacienteService.listarTodos();
export const deletePaciente = (id: number): Promise<void> => pacienteService.excluir(id);
export const createPaciente = (dados: PacienteInput): Promise<Paciente> => pacienteService.criar(dados as unknown as CriarPacienteRequest);
export const updatePaciente = (dados: PacienteInput & { id: number }): Promise<Paciente> => pacienteService.atualizar(dados as unknown as AtualizarPacienteRequest);
export const getPacienteById = (id: number): Promise<Paciente | null> => pacienteService.buscarPorId(id);
export const searchPacientes = (termo: string): Promise<Paciente[]> => pacienteService.buscarPorNome(termo);

// ✅ EXPORTAÇÃO DA INSTÂNCIA PARA USO MODERNO
export { pacienteService };
