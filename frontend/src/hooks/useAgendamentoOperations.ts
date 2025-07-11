import apiService from '@/services/apiService';
import { toast } from './use-toast';

export const useAgendamentoOperations = () => {
    const salvarAgendamento = async (
        agendamentoData: any,
        queryClient: any,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => {
        try {
            // 🏥 1. CRIAR O AGENDAMENTO
            const response = await apiService.post('/api/agendamentos', agendamentoData);
            const agendamentoCriado = response.data;

            console.log('✅ Agendamento criado:', agendamentoCriado);

            // ♻️ 2. INVALIDAR QUERIES
            queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
            queryClient.invalidateQueries({ queryKey: ['estatisticas-recepcao'] });

            // 🎯 3. LÓGICA DE IMPRESSÃO AUTOMÁTICA - COM PROTEÇÃO CONTRA ERROS
            await processarImpressaoAutomaticaSegura(agendamentoCriado, agendamentoData);

            onSuccess();
        } catch (error) {
            console.error('❌ Erro ao criar recepcao:', error);
            onError('Erro ao criar recepcao. Tente novamente.');
        }
    };

    const processarImpressaoAutomaticaSegura = async (agendamento: any, dadosOriginais: any) => {
        try {
            const tipoAtendimento = agendamento.tipoAtendimento || dadosOriginais.tipo;

            console.log('🎯 Processando impressão automática para:', {
                agendamentoId: agendamento.id,
                tipo: tipoAtendimento,
                isExame: isExame(tipoAtendimento),
                isConsulta: isConsulta(tipoAtendimento)
            });

            if (isExame(tipoAtendimento)) {
                // 📋 EXAMES: Gerar e imprimir SADT
                console.log('📋 → Direcionando para impressão de SADT');
                await gerarEImprimirSadtSeguro(agendamento.id, agendamento, dadosOriginais);
            } else if (isConsulta(tipoAtendimento)) {
                // 🩺 CONSULTAS: Imprimir comprovante
                console.log('🩺 → Direcionando para impressão de comprovante');
                await imprimirComprovanteConsulta(agendamento, dadosOriginais);
            }
        } catch (error) {
            console.error('⚠️ Erro na impressão automática (não crítico):', error);
            // Não bloquear o processo - apenas avisar
            toast({
                title: "⚠️ Impressão Automática",
                description: "Agendamento criado com sucesso! Use os botões manuais para imprimir.",
                className: "bg-yellow-100 text-yellow-800",
            });
        }
    };

    const gerarEImprimirSadtSeguro = async (agendamentoId: number, agendamento: any, dadosOriginais: any) => {
        try {
            console.log('📋 INICIANDO processo SEGURO de SADT para recepcao:', agendamentoId);

            // 🛡️ VERIFICAÇÃO LOCAL PRIMEIRO (sem depender do backend)
            const precisaSadtLocal = isPrecisaSadtLocal(agendamento.tipoAtendimento);

            if (!precisaSadtLocal) {
                console.log('📋 ❌ Tipo de recepcao NÃO precisa de SADT');
                toast({
                    title: "📋 Processamento Concluído",
                    description: "Este tipo de recepcao não requer SADT.",
                    className: "bg-blue-100 text-blue-800",
                });
                return;
            }

            console.log('📋 ✅ Agendamento precisa de SADT - prosseguindo...');

            // 🔧 TENTAR VERIFICAÇÃO NO BACKEND (com fallback)
            await tentarProcessarSadtComFallback(agendamentoId, agendamento, dadosOriginais);

        } catch (error) {
            console.error('❌ Erro no processo de SADT:', error);

            // 🆘 FALLBACK FINAL: Sempre mostrar prévia
            console.log('🆘 Ativando fallback final - mostrando prévia da SADT');
            mostrarPreviaSadt(agendamentoId, agendamento, dadosOriginais);

            toast({
                title: "📋 SADT Gerada (Prévia)",
                description: "A SADT foi gerada em modo de prévia. Implementação completa em desenvolvimento.",
                className: "bg-yellow-100 text-yellow-800",
            });
        }
    };

    const tentarProcessarSadtComFallback = async (agendamentoId: number, agendamento: any, dadosOriginais: any) => {
        try {
            console.log('🔍 ETAPA 1: Tentando verificação no backend...');

            // Tentar verificação no backend (com timeout curto)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 3000)
            );

            const verificacaoPromise = apiService.get(`/api/agendamentos/${agendamentoId}/precisa-sadt`);

            const { data: verificacao } = await Promise.race([verificacaoPromise, timeoutPromise]) as any;

            console.log('🔍 Resultado da verificação backend:', verificacao);

            if (!verificacao.precisaSadt) {
                console.log('📋 Backend confirmou que NÃO precisa de SADT');
                return;
            }

            // 🔧 TENTAR GERAR SADT REAL
            await tentarGerarSadtReal(agendamentoId, agendamento, dadosOriginais);

        } catch (backendError: any) {
            console.log('⚠️ Backend indisponível ou com erro, usando fallback local');

            // 🆘 FALLBACK: Processar localmente
            await processarSadtLocal(agendamentoId, agendamento, dadosOriginais);
        }
    };

    const tentarGerarSadtReal = async (agendamentoId: number, agendamento: any, dadosOriginais: any) => {
        try {
            console.log('🔧 ETAPA 2: Tentando gerar SADT real...');

            const requestSadt = {
                agendamentoId: agendamentoId,
                pacienteId: dadosOriginais.pacienteId,
                procedimentos: obterProcedimentosPorTipo(agendamento, dadosOriginais),
                observacoes: dadosOriginais.observacoes || null,
                urgente: dadosOriginais.prioridade === 'urgente'
            };

            console.log('📋 Dados da requisição SADT:', requestSadt);

            // Tentar o endpoint correto da SADT
            const { data: sadtResponse } = await apiService.post('/api/sadt/gerar', requestSadt);

            console.log('✅ SADT real gerada com sucesso:', sadtResponse);

            // Imprimir o PDF real
            if (sadtResponse.pdfBase64) {
                console.log('🖨️ ETAPA 3: Imprimindo PDF real da SADT...');
                imprimirPdfBase64(sadtResponse.pdfBase64);

                toast({
                    title: "🖨️ SADT Oficial Impressa!",
                    description: `SADT ${sadtResponse.numeroSadt} foi gerada e enviada para impressão.`,
                    className: "bg-green-100 text-green-800",
                });
            } else {
                throw new Error('PDF não foi gerado pelo backend');
            }

        } catch (sadtError: any) {
            console.log('❌ Erro na geração da SADT real:', sadtError.response?.status, sadtError.message);

            // 🆘 FALLBACK para processamento local
            throw new Error('SADT real não disponível');
        }
    };

    const processarSadtLocal = async (agendamentoId: number, agendamento: any, dadosOriginais: any) => {
        console.log('🏠 PROCESSAMENTO LOCAL: Gerando SADT de prévia...');

        mostrarPreviaSadt(agendamentoId, agendamento, dadosOriginais);

        toast({
            title: "📋 SADT Gerada (Modo Local)",
            description: "SADT gerada localmente. A funcionalidade completa está sendo implementada.",
            className: "bg-blue-100 text-blue-800",
        });
    };

    // 🛡️ VERIFICAÇÃO LOCAL se precisa de SADT
    const isPrecisaSadtLocal = (tipoAtendimento: string): boolean => {
        const tiposComSadt = [
            'exame_laboratorial',
            'exame_imagem',
            'procedimento'
        ];
        return tiposComSadt.includes(tipoAtendimento);
    };

    // 🆕 FUNÇÃO: Mostrar prévia da SADT
    const mostrarPreviaSadt = (agendamentoId: number, agendamento: any, dadosOriginais: any) => {
        console.log('👀 ETAPA FINAL: Mostrando prévia da SADT...');

        const procedimentos = obterProcedimentosPorTipo(agendamento, dadosOriginais);
        const htmlPrevia = gerarHtmlPreviaSadt(agendamentoId, agendamento, dadosOriginais, procedimentos);

        console.log('🖨️ Abrindo janela com prévia da SADT...');
        imprimirHtml(htmlPrevia);
    };

    // 🆕 FUNÇÃO MELHORADA: Obter procedimentos
    const obterProcedimentosPorTipo = (agendamento: any, dadosOriginais: any) => {
        const tipo = agendamento.tipoAtendimento || dadosOriginais.tipo;

        // 1️⃣ Se tem exames selecionados no recepcao criado
        if (agendamento.examesSelecionadosList && agendamento.examesSelecionadosList.length > 0) {
            return agendamento.examesSelecionadosList.map((exame: string, index: number) => ({
                codigo: `EXAM_${(index + 1).toString().padStart(3, '0')}`,
                nome: exame,
                quantidade: 1,
                valor: obterValorProcedimento(exame)
            }));
        }

        // 2️⃣ Se tem exames nos dados originais
        if (dadosOriginais.examesSelecionados && dadosOriginais.examesSelecionados.length > 0) {
            return dadosOriginais.examesSelecionados.map((exame: string, index: number) => ({
                codigo: `EXAM_${(index + 1).toString().padStart(3, '0')}`,
                nome: exame,
                quantidade: 1,
                valor: obterValorProcedimento(exame)
            }));
        }

        // 3️⃣ Fallback baseado no tipo
        const procedimentosPorTipo: Record<string, any[]> = {
            'exame_laboratorial': [
                { codigo: 'LAB001', nome: 'Hemograma Completo', quantidade: 1, valor: 25.00 },
                { codigo: 'LAB002', nome: 'Glicemia de Jejum', quantidade: 1, valor: 15.00 },
                { codigo: 'LAB003', nome: 'Urina Tipo I', quantidade: 1, valor: 12.00 }
            ],
            'exame_imagem': [
                { codigo: 'IMG001', nome: 'Raio-X de Tórax (PA)', quantidade: 1, valor: 80.00 },
                { codigo: 'IMG002', nome: 'Ultrassom Abdominal', quantidade: 1, valor: 120.00 }
            ],
            'procedimento': [
                { codigo: 'PROC001', nome: 'Pequena Cirurgia', quantidade: 1, valor: 150.00 },
                { codigo: 'PROC002', nome: 'Curativo Especial', quantidade: 1, valor: 35.00 }
            ]
        };

        return procedimentosPorTipo[tipo] || [
            { codigo: 'GEN001', nome: 'Procedimento Geral', quantidade: 1, valor: 30.00 }
        ];
    };

    // 🆕 FUNÇÃO: Obter valor do procedimento
    const obterValorProcedimento = (nomeProcedimento: string): number => {
        const valores: Record<string, number> = {
            // Exames Laboratoriais
            'Hemograma Completo': 25.00,
            'Glicemia de Jejum': 15.00,
            'Colesterol Total': 18.00,
            'Triglicérides': 18.00,
            'Urina Tipo I': 12.00,
            'TSH': 35.00,
            'T4 Livre': 32.00,

            // Exames de Imagem
            'Raio-X de Tórax': 80.00,
            'Raio-X de Coluna': 85.00,
            'Ultrassom Abdominal': 120.00,
            'Ultrassom Pélvico': 110.00,
            'Mamografia': 95.00,

            // Procedimentos
            'Pequena Cirurgia': 150.00,
            'Curativo Simples': 20.00,
            'Curativo Especial': 35.00,
            'Sutura Simples': 45.00
        };

        return valores[nomeProcedimento] || 30.00;
    };

    // 🆕 FUNÇÃO MELHORADA: Gerar HTML da prévia da SADT
    const gerarHtmlPreviaSadt = (agendamentoId: number, agendamento: any, dadosOriginais: any, procedimentos: any[]) => {
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
        const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const numeroSadt = `SADT${agendamentoId.toString().padStart(6, '0')}`;

        const valorTotal = procedimentos.reduce((sum, proc) => sum + (proc.valor * proc.quantidade), 0);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>PRÉVIA SADT - ${numeroSadt}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.4;
                        color: #333;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #0066cc; 
                        margin-bottom: 20px; 
                        padding-bottom: 15px;
                    }
                    .logo { 
                        font-size: 20px; 
                        font-weight: bold; 
                        color: #0066cc;
                        margin-bottom: 5px; 
                    }
                    .subtitle { 
                        font-size: 14px; 
                        color: #666; 
                        margin-bottom: 10px;
                    }
                    .documento-titulo {
                        font-size: 18px;
                        font-weight: bold;
                        color: #0066cc;
                        margin-top: 10px;
                    }
                    .info-section { 
                        margin: 20px 0; 
                        padding: 15px; 
                        background-color: #f8f9fa; 
                        border-radius: 8px;
                        border-left: 4px solid #0066cc;
                    }
                    .info-section h3 {
                        margin-top: 0;
                        color: #0066cc;
                        font-size: 16px;
                    }
                    .info-row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 8px 0;
                        padding: 5px 0;
                    }
                    .label { 
                        font-weight: bold; 
                        color: #333;
                        min-width: 150px;
                    }
                    .value {
                        color: #555;
                        text-align: right;
                        flex: 1;
                    }
                    .procedures-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                        font-size: 14px;
                    }
                    .procedures-table th, .procedures-table td { 
                        border: 1px solid #ddd; 
                        padding: 10px; 
                        text-align: left; 
                    }
                    .procedures-table th { 
                        background-color: #0066cc; 
                        color: white;
                        font-weight: bold;
                    }
                    .procedures-table tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .procedures-table tr:hover {
                        background-color: #e3f2fd;
                    }
                    .valor-cell {
                        text-align: right;
                        font-weight: bold;
                    }
                    .total-row {
                        background-color: #e3f2fd !important;
                        font-weight: bold;
                    }
                    .footer { 
                        margin-top: 40px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                        border-top: 2px solid #ddd; 
                        padding-top: 15px; 
                    }
                    .preview-banner { 
                        background-color: #fff3cd; 
                        border: 2px solid #ffc107; 
                        padding: 15px; 
                        margin-bottom: 20px; 
                        text-align: center; 
                        border-radius: 8px;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { background-color: #fff3cd; }
                        50% { background-color: #ffeaa7; }
                        100% { background-color: #fff3cd; }
                    }
                    .observacoes {
                        background-color: #f0f8ff;
                        border: 1px solid #cce7ff;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .assinaturas {
                        margin-top: 50px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .assinatura {
                        text-align: center;
                        padding: 20px;
                        border-top: 1px solid #333;
                        min-width: 200px;
                    }
                </style>
            </head>
            <body>
                <div class="preview-banner">
                    <strong>⚠️ PRÉVIA DE SADT - SISTEMA EM DESENVOLVIMENTO ⚠️</strong><br>
                    Esta é uma visualização do documento que seria gerado oficialmente.<br>
                    <small>Gerado em modo de prévia - ${dataFormatada} às ${horaFormatada}</small>
                </div>

                <div class="header">
                    <div class="logo">🏥 SECRETARIA MUNICIPAL DE SAÚDE</div>
                    <div class="subtitle">CIDADE SAÚDE DIGITAL - Sistema Integrado de Saúde</div>
                    <div class="documento-titulo">📋 SOLICITAÇÃO DE AUTORIZAÇÃO DE DIAGNÓSTICO E TERAPIA (SADT)</div>
                </div>

                <div class="info-section">
                    <h3>📄 Identificação do Documento</h3>
                    <div class="info-row">
                        <span class="label">Número da SADT:</span>
                        <span class="value">${numeroSadt}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Data de Emissão:</span>
                        <span class="value">${dataFormatada}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Hora de Emissão:</span>
                        <span class="value">${horaFormatada}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Protocolo Agendamento:</span>
                        <span class="value">#${agendamentoId.toString().padStart(6, '0')}</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>👤 Dados do Paciente</h3>
                    <div class="info-row">
                        <span class="label">ID do Paciente:</span>
                        <span class="value">${dadosOriginais.pacienteId}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Tipo de Atendimento:</span>
                        <span class="value">${formatarTipoAtendimento(agendamento.tipoAtendimento)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Prioridade:</span>
                        <span class="value">${(dadosOriginais.prioridade || 'normal').toUpperCase()}</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>🩺 Procedimentos/Exames Solicitados</h3>
                    <table class="procedures-table">
                        <thead>
                            <tr>
                                <th style="width: 80px;">Código</th>
                                <th>Procedimento/Exame</th>
                                <th style="width: 60px;">Qtd</th>
                                <th style="width: 100px;">Valor Unit.</th>
                                <th style="width: 100px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${procedimentos.map(proc => `
                                <tr>
                                    <td>${proc.codigo}</td>
                                    <td>${proc.nome}</td>
                                    <td style="text-align: center;">${proc.quantidade}</td>
                                    <td class="valor-cell">R$ ${proc.valor.toFixed(2)}</td>
                                    <td class="valor-cell">R$ ${(proc.valor * proc.quantidade).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="4" style="text-align: right; font-weight: bold;">VALOR TOTAL:</td>
                                <td class="valor-cell">R$ ${valorTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                ${dadosOriginais.observacoes ? `
                <div class="info-section">
                    <h3>📝 Observações Clínicas</h3>
                    <div class="observacoes">
                        ${dadosOriginais.observacoes}
                    </div>
                </div>
                ` : ''}

                <div class="info-section">
                    <h3>✅ Autorização</h3>
                    <div class="info-row">
                        <span class="label">Status:</span>
                        <span class="value">✅ AUTORIZADO</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Autorizado por:</span>
                        <span class="value">Sistema Automatizado</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Validade:</span>
                        <span class="value">30 dias a partir da emissão</span>
                    </div>
                </div>

                <div class="assinaturas">
                    <div class="assinatura">
                        <div>Médico Solicitante</div>
                        <small>CRM: _________</small>
                    </div>
                    <div class="assinatura">
                        <div>Responsável pela Autorização</div>
                        <small>Sistema Municipal de Saúde</small>
                    </div>
                </div>

                <div class="footer">
                    <strong>📍 UNIDADE DE SAÚDE MUNICIPAL</strong><br>
                    Endereço: Rua da Saúde, 123 - Centro - Cidade/UF<br>
                    Telefone: (11) 1234-5678 | E-mail: saude@cidade.gov.br<br>
                    <br>
                    <strong>⚠️ DOCUMENTO GERADO EM MODO DE PRÉVIA ⚠️</strong><br>
                    <small>Este documento foi gerado pelo sistema em desenvolvimento.<br>
                    Para uso oficial, aguarde a implementação completa da funcionalidade SADT.</small><br>
                    <br>
                    <small>Sistema Cidade Saúde Digital v2.0 - ${new Date().toLocaleString('pt-BR')}</small>
                </div>
            </body>
            </html>
        `;
    };

    // 🔧 FUNÇÃO PARA IMPRIMIR PDF A PARTIR DE BASE64
    const imprimirPdfBase64 = (pdfBase64: string) => {
        try {
            console.log('🖨️ Processando PDF Base64 para impressão...');

            const byteCharacters = atob(pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const printWindow = window.open(url, '_blank');

            if (printWindow) {
                console.log('✅ Janela de impressão aberta com sucesso');
                printWindow.addEventListener('load', () => {
                    printWindow.print();
                });
            } else {
                throw new Error('Não foi possível abrir janela de impressão');
            }
        } catch (error) {
            console.error('❌ Erro ao imprimir PDF:', error);
            throw error;
        }
    };

    const imprimirComprovanteConsulta = async (agendamento: any, dadosOriginais: any) => {
        try {
            console.log('🩺 Gerando comprovante de consulta para recepcao:', agendamento.id);

            const comprovanteHtml = gerarComprovanteConsultaHtml(agendamento, dadosOriginais);

            console.log('🖨️ Abrindo janela com comprovante de consulta...');
            imprimirHtml(comprovanteHtml);

            toast({
                title: "🖨️ Comprovante Impresso!",
                description: "O comprovante de recepcao foi enviado para impressão.",
                className: "bg-blue-100 text-blue-800",
            });
        } catch (error) {
            console.error('❌ Erro ao imprimir comprovante:', error);
            toast({
                title: "⚠️ Comprovante não foi impresso",
                description: "O recepcao foi criado, mas houve erro na impressão do comprovante.",
                variant: "destructive",
            });
        }
    };

    const gerarComprovanteConsultaHtml = (agendamento: any, dadosOriginais: any): string => {
        const dataAgendamento = new Date(agendamento.dataHora || dadosOriginais.dataHora);
        const dataFormatada = dataAgendamento.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const horaFormatada = dataAgendamento.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const tipoConsulta = formatarTipoConsulta(agendamento.tipoAtendimento || dadosOriginais.tipo);
        const especialidade = agendamento.especialidade || dadosOriginais.especialidade || 'Não especificada';
        const profissional = obterProfissionalPorEspecialidade(especialidade);
        const unidade = agendamento.unidade || dadosOriginais.unidade || 'Unidade Principal de Saúde';
        const prioridade = agendamento.prioridade || dadosOriginais.prioridade || 'Normal';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Comprovante de Agendamento</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #2563eb;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                    }
                    .logo {
                        color: #2563eb;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .subtitle {
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .content {
                        margin: 20px 0;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0;
                        padding: 8px;
                        background-color: #f8fafc;
                        border-radius: 4px;
                    }
                    .label {
                        font-weight: bold;
                        color: #374151;
                    }
                    .value {
                        color: #6b7280;
                    }
                    .destaque {
                        background-color: #dbeafe;
                        border-left: 4px solid #2563eb;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        color: #6b7280;
                        font-size: 12px;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 10px;
                    }
                    .instrucoes {
                        background-color: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .prioridade-alta {
                        background-color: #fee2e2;
                        border-left: 4px solid #ef4444;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🏥 CIDADE SAÚDE DIGITAL</div>
                    <div class="subtitle">Sistema Integrado de Saúde Municipal</div>
                </div>

                <div class="content">
                    <h2 style="color: #2563eb; text-align: center;">📅 COMPROVANTE DE AGENDAMENTO</h2>

                    <div class="destaque">
                        <div style="text-align: center; font-size: 18px; font-weight: bold; color: #1e40af;">
                            ${tipoConsulta}
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="label">📅 Data:</span>
                        <span class="value">${dataFormatada}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">🕐 Horário:</span>
                        <span class="value">${horaFormatada}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">🏥 Local:</span>
                        <span class="value">${unidade}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">👨‍⚕️ Profissional:</span>
                        <span class="value">${profissional}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">🩺 Especialidade:</span>
                        <span class="value">${especialidade}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">📋 Protocolo:</span>
                        <span class="value">#${agendamento.id || 'Processando...'}</span>
                    </div>

                    ${prioridade === 'urgente' ? `
                    <div class="instrucoes prioridade-alta">
                        <strong>⚠️ ATENDIMENTO PRIORITÁRIO</strong><br>
                        Este agendamento possui prioridade URGENTE. Apresente-se com 30 minutos de antecedência.
                    </div>
                    ` : `
                    <div class="instrucoes">
                        <strong>📝 INSTRUÇÕES IMPORTANTES:</strong><br>
                        • Chegue com 15 minutos de antecedência<br>
                        • Traga documento de identidade e cartão SUS<br>
                        • Em caso de impossibilidade, cancele com antecedência<br>
                        • Mantenha este comprovante até a data do atendimento
                    </div>
                    `}
                </div>

                <div class="footer">
                    Comprovante gerado em ${new Date().toLocaleString('pt-BR')}<br>
                    Sistema Cidade Saúde Digital - Prefeitura Municipal
                </div>
            </body>
            </html>
        `;
    };

    const imprimirHtml = (htmlContent: string) => {
        console.log('🖨️ Abrindo janela de impressão HTML...');

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Aguardar carregamento e então imprimir
            printWindow.addEventListener('load', () => {
                console.log('✅ Janela carregada, iniciando impressão automática');
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            });
        } else {
            console.error('❌ Não foi possível abrir janela de impressão');
            alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
        }
    };

    // 🔧 FUNÇÕES AUXILIARES
    const isExame = (tipo: string): boolean => {
        return ['exame_laboratorial', 'exame_imagem', 'procedimento'].includes(tipo);
    };

    const isConsulta = (tipo: string): boolean => {
        return ['consulta_medica', 'consulta_enfermagem', 'vacina'].includes(tipo);
    };

    const formatarTipoConsulta = (tipo: string): string => {
        const tipos: Record<string, string> = {
            'consulta_medica': '🩺 Consulta Médica',
            'consulta_enfermagem': '👩‍⚕️ Consulta de Enfermagem',
            'vacina': '💉 Vacinação',
            'procedimento': '🔬 Procedimento Médico'
        };
        return tipos[tipo] || tipo.replace('_', ' ').toUpperCase();
    };

    const formatarTipoAtendimento = (tipo: string): string => {
        const tipos: Record<string, string> = {
            'consulta_medica': 'Consulta Médica',
            'consulta_enfermagem': 'Consulta de Enfermagem',
            'exame_laboratorial': 'Exame Laboratorial',
            'exame_imagem': 'Exame de Imagem',
            'procedimento': 'Procedimento Médico',
            'vacina': 'Vacinação'
        };
        return tipos[tipo] || tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const obterProfissionalPorEspecialidade = (especialidade: string): string => {
        const profissionais: Record<string, string> = {
            'clinica_geral': 'Dr. João Silva - CRM 12345/SP',
            'pediatria': 'Dra. Maria Santos - CRM 67890/SP',
            'cardiologia': 'Dr. Pedro Costa - CRM 54321/SP',
            'ginecologia': 'Dra. Ana Oliveira - CRM 98765/SP',
            'ortopedia': 'Dr. Carlos Lima - CRM 11111/SP',
            'dermatologia': 'Dra. Lucia Ferreira - CRM 22222/SP',
            'enfermagem': 'Enf. Fernanda Alves - COREN 333333/SP',
            'vacinacao': 'Enf. Roberto Mendes - COREN 444444/SP'
        };
        return profissionais[especialidade] || 'Profissional será definido';
    };

    const atualizarStatus = async (
        agendamentoId: number,
        novoStatus: string,
        queryClient: any,
        refetch: () => void,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => {
        try {
            await apiService.put(`/api/agendamentos/${agendamentoId}/status`, {
                status: novoStatus
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ['estatisticas-recepcao'] });
            onSuccess();
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            onError('Erro ao atualizar status. Tente novamente.');
        }
    };

    return { salvarAgendamento, atualizarStatus };
};
