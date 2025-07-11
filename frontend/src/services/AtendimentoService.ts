import apiService from "@/services/apiService";

// ✅ INTERFACES PRESERVADAS E MELHORADAS
export interface Atendimento {
  id?: string;
  pacienteId: string;
  cid10: string;
  diagnostico?: string; // Opcional
  prescricao?: string; // Opcional
  observacoes?: string; // Novo campo
  dataHora?: string;
}

export interface AtendimentoRequest {
  pacienteId: string;
  cid10: string;
  diagnostico?: string;
  prescricao?: string;
  observacoes?: string; // Novo campo
}

// ✅ ALIAS PARA COMPATIBILIDADE
export type AtendimentoDTO = Atendimento;
export type CriarAtendimentoRequest = AtendimentoRequest;

export class AtendimentoService {

  /**
   * Lista todos os atendimentos de um paciente específico
   * MANTÉM COMPATIBILIDADE COM VERSÃO EXISTENTE
   */
  async listarPorPaciente(pacienteId: string): Promise<Atendimento[]> {
    // 🔍 VALIDAÇÃO RIGOROSA PRESERVADA
    if (!pacienteId || pacienteId.trim() === '') {
      console.warn('⚠️ AtendimentoService.listarPorPaciente: pacienteId está vazio');
      return [];
    }

    const pacienteIdLimpo = pacienteId.trim();

    try {
      console.log('🔍 AtendimentoService: Buscando atendimentos para paciente ID:', pacienteIdLimpo);

      // ✅ USA NOVA ROTA DO BACKEND ATUALIZADO
      const response = await apiService.get<{
        success: boolean;
        data: Atendimento[];
        message?: string;
      }>(`/api/atendimentos?pacienteId=${pacienteIdLimpo}`);

      console.log('📊 AtendimentoService: Resposta recebida:', {
        success: response.data.success,
        totalAtendimentos: response.data.data?.length || 0,
        hasData: !!response.data.data
      });

      // Validar estrutura da resposta
      if (!response.data.success) {
        console.warn('⚠️ AtendimentoService: Resposta indica falha:', response.data.message);
        return [];
      }

      const atendimentos = response.data.data || [];
      console.log(`✅ AtendimentoService: ${atendimentos.length} atendimento(s) encontrado(s)`);

      return atendimentos;

    } catch (error: any) {
      console.error('❌ AtendimentoService.listarPorPaciente: Erro capturado:', error);

      // TRATAMENTO DE ERROS PRESERVADO E MELHORADO
      if (error.response) {
        const { status, data } = error.response;
        console.error(`📊 AtendimentoService: Status HTTP ${status}:`, data);

        switch (status) {
          case 400:
            console.error('🚫 Erro 400: Requisição inválida');
            break;
          case 403:
            console.error('🔐 Erro 403: Acesso negado');
            break;
          case 404:
            console.error('🔍 Erro 404: Recurso não encontrado');
            break;
          case 500:
            console.error('🔥 Erro 500: Erro interno do servidor');
            break;
          default:
            console.error(`❓ Erro ${status}: ${error.message}`);
        }
      } else {
        console.error('❓ AtendimentoService: Erro de rede ou desconhecido:', error.message);
      }

      return [];
    }
  }

  /**
   * Lista todos os atendimentos - NOVA FUNCIONALIDADE
   */
  async listarTodos(): Promise<Atendimento[]> {
    try {
      console.log('📋 AtendimentoService: Listando todos os atendimentos');

      const response = await apiService.get<{
        success: boolean;
        data: Atendimento[];
        message?: string;
      }>('/api/atendimentos');

      if (response.data.success) {
        console.log('✅ AtendimentoService: Todos os atendimentos carregados:', response.data.data.length);
        return response.data.data || [];
      } else {
        console.warn('⚠️ AtendimentoService: Falha ao carregar todos os atendimentos');
        return [];
      }

    } catch (error: any) {
      console.error('❌ AtendimentoService.listarTodos: Erro:', error);
      return [];
    }
  }

  /**
   * Salva/Cria um novo atendimento
   * PRESERVA FUNCIONALIDADE EXISTENTE
   */
  async salvar(atendimento: AtendimentoRequest): Promise<Atendimento | null> {
    // 🔍 VALIDAÇÃO PRESERVADA
    if (!atendimento.pacienteId || !atendimento.cid10) {
      console.warn('⚠️ AtendimentoService.salvar: Dados obrigatórios não fornecidos');
      throw new Error('PacienteId e CID10 são obrigatórios');
    }

    try {
      console.log('💾 AtendimentoService: Salvando atendimento para paciente:', atendimento.pacienteId);

      const response = await apiService.post<{
        success: boolean;
        data: Atendimento;
        message?: string;
      }>('/api/atendimentos', atendimento);

      if (!response.data.success) {
        console.warn('⚠️ AtendimentoService.salvar: Falha ao salvar:', response.data.message);
        return null;
      }

      console.log('✅ AtendimentoService: Atendimento salvo com sucesso, ID:', response.data.data.id);
      return response.data.data;

    } catch (error: any) {
      console.error('❌ AtendimentoService.salvar: Erro ao salvar atendimento:', error);

      if (error.response?.status === 400) {
        console.error('🚫 Verificar dados de entrada e configuração do banco');
      }

      throw new Error('Não foi possível salvar o atendimento. Verifique os dados e tente novamente.');
    }
  }

  /**
   * Criar atendimento - ALIAS PARA COMPATIBILIDADE
   */
  async criar(dados: AtendimentoRequest): Promise<Atendimento> {
    const resultado = await this.salvar(dados);
    if (!resultado) {
      throw new Error('Falha ao criar atendimento');
    }
    return resultado;
  }

  /**
   * Buscar por ID - NOVA FUNCIONALIDADE
   */
  async buscarPorId(id: string): Promise<Atendimento> {
    try {
      console.log('🔍 AtendimentoService: Buscando atendimento por ID:', id);

      const response = await apiService.get<{
        success: boolean;
        data: Atendimento;
        message?: string;
      }>(`/api/atendimentos/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Atendimento não encontrado');
      }

    } catch (error: any) {
      console.error('❌ AtendimentoService.buscarPorId: Erro:', error);
      throw new Error('Erro ao buscar atendimento');
    }
  }

  /**
   * Atualizar atendimento - NOVA FUNCIONALIDADE
   */
  async atualizar(id: string, dados: Partial<AtendimentoRequest>): Promise<Atendimento> {
    try {
      console.log('🔄 AtendimentoService: Atualizando atendimento:', id);

      const response = await apiService.put<{
        success: boolean;
        data: Atendimento;
        message?: string;
      }>(`/api/atendimentos/${id}`, dados);

      if (response.data.success) {
        console.log('✅ AtendimentoService: Atendimento atualizado');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar atendimento');
      }

    } catch (error: any) {
      console.error('❌ AtendimentoService.atualizar: Erro:', error);
      throw new Error('Erro ao atualizar atendimento');
    }
  }

  /**
   * Excluir atendimento - NOVA FUNCIONALIDADE
   */
  async excluir(id: string): Promise<void> {
    try {
      console.log('🗑️ AtendimentoService: Excluindo atendimento:', id);

      const response = await apiService.delete<{
        success: boolean;
        message?: string;
      }>(`/api/atendimentos/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao excluir atendimento');
      }

      console.log('✅ AtendimentoService: Atendimento excluído');

    } catch (error: any) {
      console.error('❌ AtendimentoService.excluir: Erro:', error);
      throw new Error('Erro ao excluir atendimento');
    }
  }

  /**
   * Baixa o PDF de um atendimento específico
   * PRESERVA FUNCIONALIDADE EXISTENTE
   */
  async baixarPdf(atendimentoId: string): Promise<Blob> {
    if (!atendimentoId || atendimentoId.trim() === '') {
      throw new Error('ID do atendimento é obrigatório para baixar PDF');
    }

    try {
      console.log('📄 AtendimentoService: Baixando PDF do atendimento:', atendimentoId);

      const response = await apiService.get(
          `/api/atendimentos/${atendimentoId}/pdf`,
          {
            responseType: "blob",
          },
      );

      console.log('✅ AtendimentoService: PDF baixado com sucesso');
      return response.data;

    } catch (error: any) {
      console.error('❌ AtendimentoService.baixarPdf: Erro ao baixar PDF:', error);

      if (error.response?.status === 403) {
        throw new Error('Sem permissão para baixar este PDF. Verifique suas credenciais.');
      } else if (error.response?.status === 404) {
        throw new Error('Atendimento não encontrado ou PDF não disponível.');
      }

      throw new Error('Não foi possível baixar o PDF. Tente novamente mais tarde.');
    }
  }

  /**
   * Busca atendimentos por período
   * PRESERVA FUNCIONALIDADE EXISTENTE
   */
  async listarPorPeriodo(dataInicio: string, dataFim: string): Promise<Atendimento[]> {
    try {
      console.log('📅 AtendimentoService: Buscando atendimentos por período:', { dataInicio, dataFim });

      const response = await apiService.get<{
        success: boolean;
        data: Atendimento[];
      }>(`/api/atendimentos/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);

      if (response.data.success) {
        return response.data.data || [];
      } else {
        console.warn('⚠️ Falha ao buscar por período');
        return [];
      }

    } catch (error: any) {
      console.error('❌ AtendimentoService.listarPorPeriodo: Erro:', error);
      return [];
    }
  }

  /**
   * Gerar PDF - ALIAS PARA COMPATIBILIDADE
   */
  async gerarPdf(id: string): Promise<Blob> {
    return this.baixarPdf(id);
  }
}

// Exportar instância única do serviço - PRESERVADO
export const atendimentoService = new AtendimentoService();