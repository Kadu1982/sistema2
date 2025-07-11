import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';

interface EstatisticasRecepcao {
    total: number;
    agendados: number;
    confirmados: number;
    realizados: number;
    cancelados: number;
}

export const useEstatisticas = () => {
    const { data: estatisticas } = useQuery<EstatisticasRecepcao>({
        queryKey: ['estatisticas-recepcao'],
        queryFn: async () => {
            const hoje = new Date().toISOString().split('T')[0];
            const { data } = await apiService.get('/api/agendamentos/por-data', {
                params: { data: hoje }
            });

            const total = data.length;
            const agendados = data.filter((a: any) => a.status === 'AGENDADO').length;
            const confirmados = data.filter((a: any) => a.status === 'CONFIRMADO').length;
            const realizados = data.filter((a: any) => a.status === 'REALIZADO').length;
            const cancelados = data.filter((a: any) => a.status === 'CANCELADO').length;

            return { total, agendados, confirmados, realizados, cancelados };
        },
        refetchInterval: 60000,
    });

    return estatisticas;
};
