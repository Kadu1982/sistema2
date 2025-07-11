// src/services/biometriaService.ts

// ANOTAÇÃO: Importa o serviço de API centralizado para fazer requisições HTTP.
// O '@' é um atalho configurado no projeto para o diretório 'src'.
import apiService from "@/services/apiService";

// ANOTAÇÃO: Define a estrutura de um template biométrico, garantindo a tipagem dos dados.
// Isso ajuda a prevenir erros, garantindo que todos os templates tenham o mesmo formato.
export interface BiometriaTemplate {
  id: string; // Identificador único do template.
  usuarioId: number; // ID do usuário ao qual a biometria pertence.
  templateId: string; // O ID do template biométrico em si, vindo do dispositivo de captura.
  tipo: "DEDO" | "FACE" | "IRIS"; // Define os tipos de biometria aceitos. O pipe '|' cria uma união de tipos literais.
  qualidade: number; // Um número que representa a qualidade da captura biométrica.
  ativo: boolean; // Flag para indicar se o template está ativo ou não.
  criadoEm: string; // Data e hora de quando o template foi criado, em formato de string (ISO 8601).
}

// ANOTAÇÃO: Define a estrutura da resposta padrão para as operações de biometria.
// Isso padroniza a forma como o front-end recebe feedback do back-end.
export interface BiometriaResponse {
  sucesso: boolean; // 'true' se a operação foi bem-sucedida, 'false' caso contrário.
  dados?: any; // Contém os dados retornados pela API em caso de sucesso. O '?' torna o campo opcional.
  erro?: string; // Contém a mensagem de erro em caso de falha. O '?' torna o campo opcional.
}

// ANOTAÇÃO: A classe BiometriaService agrupa todos os métodos relacionados à biometria.
// Usar uma classe para serviços ajuda a organizar o código e a lógica de negócio.
export class BiometriaService {

  // ANOTAÇÃO: MÉTODO CORRIGIDO E ADICIONADO
  // Este método estático estava sendo chamado em outros lugares, mas não existia, causando um erro fatal.
  // Sua função é registrar logs de acesso para auditoria e monitoramento.
  static logAcesso(acao: string, detalhes: any) {
    // Em um ambiente de produção, esta função enviaria os logs para um serviço de monitoramento (ex: Sentry, Datadog).
    // Aqui, estamos apenas exibindo no console para fins de desenvolvimento.
    console.log(`[Log de Acesso Biométrico] Ação: ${acao}`, detalhes);
  }

  // ANOTAÇÃO: Método para verificar uma biometria existente.
  // Recebe o ID de um template e envia para a API para verificar se corresponde a um usuário.
  async verificar(templateId: string): Promise<any> {
    try {
      // Faz uma requisição POST para o endpoint de verificação da API.
      const response = await apiService.post("/biometria/verificar", {
        templateId,
      });

      // Registra um log de que uma verificação foi tentada.
      BiometriaService.logAcesso("VERIFICACAO_BIOMETRIA", {
        templateId,
        timestamp: new Date().toISOString(),
      });

      // Retorna os dados do usuário se a verificação for bem-sucedida.
      return response.data.data;
    } catch (error) {
      // Em caso de erro na requisição, exibe o erro no console.
      console.error("Erro ao verificar biometria:", error);
      // Lança um novo erro para que o chamador possa tratar a falha.
      throw new Error("Falha na verificação biométrica");
    }
  }

  // ANOTAÇÃO: Método para listar todos os templates biométricos de um usuário específico.
  // Recebe o ID do usuário e retorna um array de BiometriaTemplate.
  async listarPorUsuario(usuarioId: number): Promise<BiometriaTemplate[]> {
    try {
      // Faz uma requisição GET para o endpoint que lista as biometrias por usuário.
      const response = await apiService.get<{ data: BiometriaTemplate[] }>(
          `/biometria/usuario/${usuarioId}`
      );
      // Retorna o array de templates contido no campo 'data' da resposta da API.
      return response.data.data;
    } catch (error) {
      // Em caso de erro, exibe a falha no console.
      console.error("Erro ao listar biometrias:", error);
      // Retorna um array vazio para evitar que a aplicação quebre.
      return [];
    }
  }

  // ANOTAÇÃO: Método estático para registrar uma nova biometria no sistema.
  // Um método estático pode ser chamado diretamente na classe (BiometriaService.registrarBiometria) sem precisar criar uma instância dela.
  static async registrarBiometria(dados: {
    usuarioId: number;
    templateId: string;
    tipo: BiometriaTemplate["tipo"];
    dispositivoId: string;
    qualidade?: number;
  }): Promise<BiometriaResponse> {
    try {
      // Faz uma requisição POST para o endpoint de registro, enviando os dados da nova biometria.
      const response = await apiService.post<BiometriaResponse>(
          "/biometria/registrar",
          dados,
      );

      // Registra um log de que uma nova biometria foi registrada com sucesso.
      BiometriaService.logAcesso("REGISTRO_BIOMETRIA", {
        usuarioId: dados.usuarioId,
        tipo: dados.tipo,
        timestamp: new Date().toISOString(),
      });

      // Retorna a resposta completa da API.
      return response.data;
    } catch (error) {
      // Em caso de falha, exibe o erro no console.
      console.error("Erro ao registrar biometria:", error);
      // Retorna um objeto de resposta padronizado indicando a falha.
      return {
        sucesso: false,
        erro: "Falha no registro biométrico",
      };
    }
  }
}
