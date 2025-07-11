import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import apiService from '@/services/apiService';
import { AgendamentoDTO } from '@/types/Agendamento';

/**
 * Hook customizado para gerenciar agendamentos por data
 * @param date - Data para buscar os agendamentos
 * @returns Objeto com agendamentos, estados de loading/error e funções de controle
 */
export const useAgendamentos = (date: Date | undefined) => {
    const queryClient = useQueryClient();
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';

    // ✅ Query principal para buscar agendamentos por data
    const {
        data: agendamentos,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
        isStale
    } = useQuery<AgendamentoDTO[]>({
        queryKey: ['agendamentos', formattedDate],
        queryFn: async () => {
            if (!formattedDate) return [];

            try {
                const { data } = await apiService.get('/api/agendamentos/por-data', {
                    params: { data: formattedDate }
                });
                return data || [];
            } catch (error: any) {
                console.error('Erro ao buscar agendamentos:', error);

                // Se o erro for 404 (não encontrado), retorna array vazio
                if (error.response?.status === 404) {
                    return [];
                }

                // Para outros erros, relança a exceção
                throw error;
            }
        },
        enabled: !!date, // Só executa se uma data for fornecida
        refetchInterval: 30000, // Atualiza a cada 30 segundos
        staleTime: 15000, // Considera os dados "frescos" por 15 segundos
        retry: 3, // Tenta novamente 3 vezes em caso de erro
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    });

    // ✅ Função para invalidar cache e forçar atualização
    const invalidateAgendamentos = () => {
        queryClient.invalidateQueries({
            queryKey: ['agendamentos']
        });
    };

    // ✅ Função para atualizar cache após criar/editar recepcao
    const updateAgendamentoInCache = (novoAgendamento: AgendamentoDTO) => {
        const dataAgendamento = format(new Date(novoAgendamento.dataHora), 'yyyy-MM-dd');

        queryClient.setQueryData(['agendamentos', dataAgendamento], (oldData: AgendamentoDTO[] | undefined) => {
            if (!oldData) return [novoAgendamento];

            // Verifica se já existe um recepcao com o mesmo ID
            const existingIndex = oldData.findIndex(ag => ag.id === novoAgendamento.id);

            if (existingIndex >= 0) {
                // Atualiza recepcao existente
                const newData = [...oldData];
                newData[existingIndex] = novoAgendamento;
                return newData;
            } else {
                // Adiciona novo recepcao
                return [...oldData, novoAgendamento];
            }
        });
    };

    // ✅ Função para remover recepcao do cache
    const removeAgendamentoFromCache = (agendamentoId: number, dataAgendamento: string) => {
        queryClient.setQueryData(['agendamentos', dataAgendamento], (oldData: AgendamentoDTO[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter(ag => ag.id !== agendamentoId);
        });
    };

    // ✅ Função para buscar agendamentos de uma data específica
    const fetchAgendamentosByDate = async (targetDate: Date): Promise<AgendamentoDTO[]> => {
        const targetFormattedDate = format(targetDate, 'yyyy-MM-dd');

        return await queryClient.fetchQuery({
            queryKey: ['agendamentos', targetFormattedDate],
            queryFn: async () => {
                try {
                    const { data } = await apiService.get('/api/agendamentos/por-data', {
                        params: { data: targetFormattedDate }
                    });
                    return data || [];
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        return [];
                    }
                    throw error;
                }
            },
            staleTime: 15000,
        });
    };

    // ✅ Função para prefetch de agendamentos (para otimizar navegação)
    const prefetchAgendamentos = (targetDate: Date) => {
        const targetFormattedDate = format(targetDate, 'yyyy-MM-dd');

        queryClient.prefetchQuery({
            queryKey: ['agendamentos', targetFormattedDate],
            queryFn: async () => {
                try {
                    const { data } = await apiService.get('/api/agendamentos/por-data', {
                        params: { data: targetFormattedDate }
                    });
                    return data || [];
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        return [];
                    }
                    throw error;
                }
            },
            staleTime: 15000,
        });
    };

    // ✅ Função para obter estatísticas dos agendamentos
    const getEstatisticas = () => {
        if (!agendamentos) {
            return {
                total: 0,
                agendados: 0,
                confirmados: 0,
                realizados: 0,
                cancelados: 0,
                faltaram: 0
            };
        }

        return {
            total: agendamentos.length,
            agendados: agendamentos.filter(ag => ag.status === 'AGENDADO').length,
            confirmados: agendamentos.filter(ag => ag.status === 'CONFIRMADO').length,
            realizados: agendamentos.filter(ag => ag.status === 'REALIZADO').length,
            cancelados: agendamentos.filter(ag => ag.status === 'CANCELADO').length,
            faltaram: agendamentos.filter(ag => ag.status === 'FALTOU').length,
        };
    };

    // ✅ Função para verificar se existe conflito de horário
    const verificarConflito = (novaDataHora: string, profissionalNome?: string): boolean => {
        if (!agendamentos) return false;

        const novaData = new Date(novaDataHora);

        return agendamentos.some(ag => {
            if (ag.status === 'CANCELADO') return false;

            const dataExistente = new Date(ag.dataHora);
            const diferencaMinutos = Math.abs(dataExistente.getTime() - novaData.getTime()) / (1000 * 60);

            // Conflito se for o mesmo profissional e diferença menor que 30 minutos
            if (profissionalNome && ag.profissionalNome === profissionalNome && diferencaMinutos < 30) {
                return true;
            }

            return false;
        });
    };

    return {
        // ✅ Dados principais
        agendamentos: agendamentos || [],

        // ✅ Estados de carregamento e erro
        isLoading,
        isError,
        error,
        isFetching,
        isStale,

        // ✅ Funções de controle
        refetch,
        invalidateAgendamentos,
        updateAgendamentoInCache,
        removeAgendamentoFromCache,
        fetchAgendamentosByDate,
        prefetchAgendamentos,

        // ✅ Funções utilitárias
        getEstatisticas,
        verificarConflito,

        // ✅ Query client para operações avançadas
        queryClient,

        // ✅ Informações adicionais
        formattedDate,
        isEmpty: !isLoading && (!agendamentos || agendamentos.length === 0),
        hasData: !isLoading && agendamentos && agendamentos.length > 0,
    };
};

// ✅ Hook para buscar agendamentos de múltiplas datas (útil para calendário)
export const useAgendamentosMultiDatas = (dates: Date[]) => {
    const queries = dates.map(date => ({
        queryKey: ['agendamentos', format(date, 'yyyy-MM-dd')],
        queryFn: async () => {
            try {
                const { data } = await apiService.get('/api/agendamentos/por-data', {
                    params: { data: format(date, 'yyyy-MM-dd') }
                });
                return { date, agendamentos: data || [] };
            } catch (error: any) {
                if (error.response?.status === 404) {
                    return { date, agendamentos: [] };
                }
                throw error;
            }
        },
        enabled: true,
        staleTime: 15000,
    }));

    return queries;
};

export default useAgendamentos;
