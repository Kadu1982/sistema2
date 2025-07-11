
import apiService from './apiService';
import { AxiosResponse } from 'axios';

// Interfaces para os tipos de dados
export interface Configuracao {
  chave: string;
  valor: string;
  descricao?: string;
  grupo?: string;
  tipo?: string;
  editavel?: boolean;
  valoresPossiveis?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  criadoPor?: string;
  atualizadoPor?: string;
}

export interface Operador {
  id?: number;
  nome: string;
  login: string;
  email?: string;
  senha?: string;
  ativo?: boolean;
  isMaster?: boolean;
  perfis: string[];
  unidadeSaude?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
  ultimoLogin?: string;
}

export interface Perfil {
  id?: number;
  nome: string;
  descricao?: string;
  permissoes: string[];
  sistemaPerfil?: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
  criadoPor?: string;
  atualizadoPor?: string;
}

// Interface para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Serviço para gerenciamento de configurações do sistema
 */
class ConfiguracaoService {
  // ✅ CORRIGIDO: Todos os endpoints agora sem prefixo /api
  private readonly configuracaoUrl = '/configuracoes';
  private readonly operadorUrl = '/operadores';
  private readonly perfilUrl = '/perfis';

  // ===== Métodos para Configurações =====

  /**
   * Lista todas as configurações
   */
  async listarConfiguracoes(): Promise<Configuracao[]> {
    try {
      console.log('🔍 ConfiguracaoService: Buscando todas as configurações...');
      const response = await apiService.get<ApiResponse<Configuracao[]>>(this.configuracaoUrl);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return [];
      }

      console.log('✅ Configurações carregadas:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao listar configurações:', error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return [];
    }
  }

  /**
   * Lista configurações por grupo
   * @param grupo Grupo de configurações
   */
  async listarConfiguracoesPorGrupo(grupo: string): Promise<Configuracao[]> {
    try {
      console.log(`🔍 ConfiguracaoService: Buscando configurações do grupo "${grupo}"...`);
      const response = await apiService.get<ApiResponse<Configuracao[]>>(`${this.configuracaoUrl}/grupo/${grupo}`);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return [];
      }

      console.log(`✅ Configurações do grupo "${grupo}" carregadas:`, response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error(`❌ Erro ao listar configurações do grupo ${grupo}:`, error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return [];
    }
  }

  /**
   * Busca uma configuração pela chave
   * @param chave Chave da configuração
   */
  async buscarConfiguracao(chave: string): Promise<Configuracao | null> {
    try {
      console.log(`🔍 ConfiguracaoService: Buscando configuração "${chave}"...`);
      const response = await apiService.get<ApiResponse<Configuracao>>(`${this.configuracaoUrl}/${chave}`);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return null;
      }

      console.log(`✅ Configuração "${chave}" encontrada`);
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar configuração ${chave}:`, error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return null;
    }
  }

  /**
   * Salva uma configuração
   * @param configuracao Dados da configuração
   */
  async salvarConfiguracao(configuracao: Configuracao): Promise<Configuracao | null> {
    try {
      console.log('💾 ConfiguracaoService: Salvando configuração:', configuracao.chave);
      const response = await apiService.post<ApiResponse<Configuracao>>(
          this.configuracaoUrl,
          configuracao
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao salvar configuração:', response.data.message);
        return null;
      }

      console.log('✅ Configuração salva com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao salvar configuração:', error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return null;
    }
  }

  /**
   * Atualiza uma configuração
   * @param chave Chave da configuração
   * @param configuracao Novos dados da configuração
   */
  async atualizarConfiguracao(chave: string, configuracao: Configuracao): Promise<Configuracao | null> {
    try {
      console.log(`🔄 ConfiguracaoService: Atualizando configuração "${chave}"...`);
      const response = await apiService.put<ApiResponse<Configuracao>>(
          `${this.configuracaoUrl}/${chave}`,
          configuracao
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao atualizar configuração:', response.data.message);
        return null;
      }

      console.log('✅ Configuração atualizada com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar configuração ${chave}:`, error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return null;
    }
  }

  /**
   * Exclui uma configuração
   * @param chave Chave da configuração
   */
  async excluirConfiguracao(chave: string): Promise<boolean> {
    try {
      console.log(`🗑️ ConfiguracaoService: Excluindo configuração "${chave}"...`);
      await apiService.delete(`${this.configuracaoUrl}/${chave}`);
      console.log('✅ Configuração excluída com sucesso');
      return true;
    } catch (error: any) {
      console.error(`❌ Erro ao excluir configuração ${chave}:`, error);

      if (error.response?.status === 400) {
        console.error('🗄️ Provável problema: Tabela "configuracoes" não existe no banco PostgreSQL');
        console.error('💡 Solução: Execute os scripts de migração do banco de dados');
      }

      return false;
    }
  }

  // ===== Métodos para Operadores =====

  /**
   * Lista todos os operadores
   */
  async listarOperadores(): Promise<Operador[]> {
    try {
      console.log('🔍 ConfiguracaoService: Buscando operadores...');
      const response = await apiService.get<ApiResponse<Operador[]>>(this.operadorUrl);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return [];
      }

      console.log('✅ Operadores carregados:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao listar operadores:', error);
      return [];
    }
  }

  /**
   * Busca um operador pelo ID
   * @param id ID do operador
   */
  async buscarOperador(id: number): Promise<Operador | null> {
    try {
      console.log(`🔍 ConfiguracaoService: Buscando operador ID ${id}...`);
      const response = await apiService.get<ApiResponse<Operador>>(`${this.operadorUrl}/${id}`);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return null;
      }

      console.log(`✅ Operador ID ${id} encontrado`);
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar operador ${id}:`, error);
      return null;
    }
  }

  /**
   * Cria um novo operador
   * @param operador Dados do operador
   */
  async criarOperador(operador: Operador): Promise<Operador | null> {
    try {
      console.log('👤 ConfiguracaoService: Criando operador:', operador.nome);
      const response = await apiService.post<ApiResponse<Operador>>(
          this.operadorUrl,
          operador
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao criar operador:', response.data.message);
        return null;
      }

      console.log('✅ Operador criado com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar operador:', error);
      return null;
    }
  }

  /**
   * Atualiza um operador existente
   * @param id ID do operador
   * @param operador Novos dados do operador
   */
  async atualizarOperador(id: number, operador: Operador): Promise<Operador | null> {
    try {
      console.log(`🔄 ConfiguracaoService: Atualizando operador ID ${id}...`);
      const response = await apiService.put<ApiResponse<Operador>>(
          `${this.operadorUrl}/${id}`,
          operador
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao atualizar operador:', response.data.message);
        return null;
      }

      console.log('✅ Operador atualizado com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar operador ${id}:`, error);
      return null;
    }
  }

  /**
   * Exclui um operador
   * @param id ID do operador
   */
  async excluirOperador(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ ConfiguracaoService: Excluindo operador ID ${id}...`);
      await apiService.delete(`${this.operadorUrl}/${id}`);
      console.log('✅ Operador excluído com sucesso');
      return true;
    } catch (error: any) {
      console.error(`❌ Erro ao excluir operador ${id}:`, error);
      return false;
    }
  }

  /**
   * Altera a senha de um operador
   * @param id ID do operador
   * @param novaSenha Nova senha
   */
  async alterarSenhaOperador(id: number, novaSenha: string): Promise<boolean> {
    try {
      console.log(`🔐 ConfiguracaoService: Alterando senha do operador ID ${id}...`);
      await apiService.patch(`${this.operadorUrl}/${id}/senha`, { novaSenha });
      console.log('✅ Senha alterada com sucesso');
      return true;
    } catch (error: any) {
      console.error(`❌ Erro ao alterar senha do operador ${id}:`, error);
      return false;
    }
  }

  /**
   * Ativa ou desativa um operador
   * @param id ID do operador
   * @param ativo Indica se o operador deve ficar ativo ou inativo
   */
  async alterarStatusOperador(id: number, ativo: boolean): Promise<Operador | null> {
    try {
      console.log(`🔄 ConfiguracaoService: ${ativo ? 'Ativando' : 'Desativando'} operador ID ${id}...`);
      const response = await apiService.patch<ApiResponse<Operador>>(
          `${this.operadorUrl}/${id}/status?ativo=${ativo}`,
          {}
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao alterar status do operador:', response.data.message);
        return null;
      }

      console.log('✅ Status do operador alterado com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao alterar status do operador ${id}:`, error);
      return null;
    }
  }

  // ===== Métodos para Perfis =====

  /**
   * Lista todos os perfis
   */
  async listarPerfis(): Promise<Perfil[]> {
    try {
      console.log('🔍 ConfiguracaoService: Buscando perfis...');
      const response = await apiService.get<ApiResponse<Perfil[]>>(this.perfilUrl);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return [];
      }

      console.log('✅ Perfis carregados:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao listar perfis:', error);
      return [];
    }
  }

  /**
   * Busca um perfil pelo ID
   * @param id ID do perfil
   */
  async buscarPerfil(id: number): Promise<Perfil | null> {
    try {
      console.log(`🔍 ConfiguracaoService: Buscando perfil ID ${id}...`);
      const response = await apiService.get<ApiResponse<Perfil>>(`${this.perfilUrl}/${id}`);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return null;
      }

      console.log(`✅ Perfil ID ${id} encontrado`);
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar perfil ${id}:`, error);
      return null;
    }
  }

  /**
   * Cria um novo perfil
   * @param perfil Dados do perfil
   */
  async criarPerfil(perfil: Perfil): Promise<Perfil | null> {
    try {
      console.log('🛡️ ConfiguracaoService: Criando perfil:', perfil.nome);
      const response = await apiService.post<ApiResponse<Perfil>>(
          this.perfilUrl,
          perfil
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao criar perfil:', response.data.message);
        return null;
      }

      console.log('✅ Perfil criado com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error);
      return null;
    }
  }

  /**
   * Atualiza um perfil existente
   * @param id ID do perfil
   * @param perfil Novos dados do perfil
   */
  async atualizarPerfil(id: number, perfil: Perfil): Promise<Perfil | null> {
    try {
      console.log(`🔄 ConfiguracaoService: Atualizando perfil ID ${id}...`);
      const response = await apiService.put<ApiResponse<Perfil>>(
          `${this.perfilUrl}/${id}`,
          perfil
      );

      if (!response.data.success) {
        console.warn('⚠️ Falha ao atualizar perfil:', response.data.message);
        return null;
      }

      console.log('✅ Perfil atualizado com sucesso');
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar perfil ${id}:`, error);
      return null;
    }
  }

  /**
   * Exclui um perfil
   * @param id ID do perfil
   */
  async excluirPerfil(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ ConfiguracaoService: Excluindo perfil ID ${id}...`);
      await apiService.delete(`${this.perfilUrl}/${id}`);
      console.log('✅ Perfil excluído com sucesso');
      return true;
    } catch (error: any) {
      console.error(`❌ Erro ao excluir perfil ${id}:`, error);
      return false;
    }
  }

  /**
   * Lista permissões disponíveis no sistema
   */
  async listarPermissoes(): Promise<string[]> {
    try {
      console.log('🔍 ConfiguracaoService: Buscando permissões disponíveis...');
      const response = await apiService.get<ApiResponse<string[]>>(`${this.perfilUrl}/permissoes`);

      if (!response.data.success) {
        console.warn('⚠️ API retornou sucesso=false:', response.data.message);
        return [];
      }

      console.log('✅ Permissões carregadas:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao listar permissões:', error);
      return [];
    }
  }
}

// Exporta uma instância única do serviço
export default new ConfiguracaoService();
