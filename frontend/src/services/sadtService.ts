/**
 * SadtService - Serviço para integração com a API de SADT do backend
 * 
 * Este serviço substitui a geração local de SADTs no frontend, permitindo
 * que o layout e a lógica de geração sejam controlados pelo backend.
 * 
 * Benefícios:
 * - Layout padronizado e consistente com as regras do sistema
 * - Centralização da lógica de geração no backend
 * - Possibilidade de atualizações no layout sem modificar o frontend
 * - Melhor integração com sistemas externos
 * 
 * Em caso de falha na comunicação com o backend, o sistema pode usar
 * o modo de fallback local implementado no hook useReimpressao.
 */
import { DadosReimpressao } from '@/types/Agendamento';
import apiService from './apiService';
import axios from 'axios'; // Ainda precisamos do axios para isAxiosError

// Usando o apiService centralizado em vez de axios direto

/**
 * Serviço para interação com a API de SADT
 */
export class SadtService {
  /**
   * Gera uma SADT no backend e retorna o PDF em base64
   */
  static async gerarSadt(dados: DadosReimpressao): Promise<{ sucesso: boolean; pdfBase64?: string; mensagem: string; erro?: string }> {
    try {
      console.log('📋 Solicitando geração de SADT ao backend para:', dados.pacienteNome);
      console.log('🔄 Dados enviados para o backend:', JSON.stringify({
        agendamentoId: dados.agendamentoId,
        pacienteId: dados.pacienteId,
        pacienteNome: dados.pacienteNome,
        tipo: dados.tipo,
        examesSelecionados: dados.examesSelecionados
      }, null, 2));

      // Mapear os exames selecionados para o formato esperado pelo backend
      const procedimentos = dados.examesSelecionados?.map(exame => ({
        codigo: this.obterCodigoExame(exame),
        nome: exame,
        quantidade: 1,
        // Campos opcionais
        cid10: '',
        justificativa: '',
        preparo: ''
      })) || [];

      // Se não houver exames selecionados, usar um procedimento padrão
      if (procedimentos.length === 0) {
        procedimentos.push({
          codigo: 'PROC001',
          nome: 'Procedimento Padrão',
          quantidade: 1,
          cid10: '',
          justificativa: '',
          preparo: ''
        });
      }

      // Preparar o payload para a API
      const payload = {
        agendamento_id: dados.agendamentoId,
        paciente_id: dados.pacienteId,
        procedimentos: procedimentos,
        observacoes: dados.observacoes || '',
        urgente: dados.prioridade === 'urgente'
      };

      // Chamar a API do backend usando apiService centralizado
      const response = await apiService.post('/api/sadt/gerar', payload);

      if (response.data && (response.data.pdf_base64 || response.data.pdfBase64)) {
        console.log('✅ SADT gerada com sucesso pelo backend');

        // Usar o campo correto dependendo do formato da resposta
        const pdfBase64 = response.data.pdf_base64 || response.data.pdfBase64;

        // Abrir o PDF em uma nova janela
        this.abrirPdfEmNovaJanela(pdfBase64);

        return {
          sucesso: true,
          pdfBase64: pdfBase64,
          mensagem: `SADT gerada com sucesso para ${dados.pacienteNome}`
        };
      } else {
        throw new Error('Resposta da API não contém o PDF');
      }
    } catch (error) {
      console.error('❌ Erro ao gerar SADT via backend:', error);

      // Tratamento específico para diferentes tipos de erro
      let mensagemErro = 'Erro ao gerar SADT';
      let detalhesErro = '';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Erro de resposta do servidor (4xx, 5xx)
          const status = error.response.status;
          if (status === 401 || status === 403) {
            mensagemErro = 'Erro de autenticação ao acessar o servidor';
            detalhesErro = 'Verifique se você está logado e tem permissão para esta operação';
          } else if (status === 404) {
            mensagemErro = 'API de SADT não encontrada no servidor';
            detalhesErro = 'Verifique se o backend está configurado corretamente';
          } else if (status >= 500) {
            mensagemErro = 'Erro interno no servidor ao gerar SADT';
            detalhesErro = `Código de erro: ${status}`;
          } else {
            mensagemErro = `Erro na requisição: ${status}`;
            detalhesErro = error.response.data?.message || error.message;
          }
        } else if (error.request) {
          // Erro de rede (sem resposta do servidor)
          mensagemErro = 'Erro de conexão com o servidor';
          detalhesErro = 'Verifique sua conexão de rede ou se o servidor está online';
        } else {
          // Erro na configuração da requisição
          mensagemErro = 'Erro ao configurar requisição para o servidor';
          detalhesErro = error.message;
        }
      } else if (error instanceof Error) {
        detalhesErro = error.message;
      }

      console.warn(`⚠️ Detalhes do erro: ${mensagemErro} - ${detalhesErro}`);

      return {
        sucesso: false,
        mensagem: mensagemErro,
        erro: detalhesErro || 'Erro desconhecido'
      };
    }
  }

  /**
   * Abre o PDF em uma nova janela do navegador
   */
  private static abrirPdfEmNovaJanela(base64: string): void {
    const pdfWindow = window.open('');
    if (!pdfWindow) {
      alert('Por favor, permita pop-ups para visualizar o PDF');
      return;
    }

    pdfWindow.document.write(`
      <html>
        <head>
          <title>SADT - Visualização</title>
          <style>body { margin: 0; }</style>
        </head>
        <body>
          <embed 
            width="100%" 
            height="100%" 
            src="data:application/pdf;base64,${base64}" 
            type="application/pdf"
          />
        </body>
      </html>
    `);
  }

  /**
   * Obtém o código do exame com base no nome
   */
  private static obterCodigoExame(nomeExame: string): string {
    // Mapeamento de nomes para códigos SIGTAP (simplificado)
    const codigosExames: Record<string, string> = {
      'Hemograma Completo': '0202020380',
      'Glicemia de Jejum': '0202010473',
      'Colesterol Total': '0202010295',
      'Urina Tipo I': '0202050017',
      'Raio-X de Tórax': '0204030153',
      'Ultrassom Abdominal': '0205020046'
    };

    return codigosExames[nomeExame] || `EXAM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }
}
