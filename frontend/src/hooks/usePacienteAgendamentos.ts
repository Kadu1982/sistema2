import { useState } from 'react';
import apiService from '@/services/apiService';

interface AgendamentoDTO {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    profissionalNome: string;
    dataHora: string;
    status: string;
    tipo: string;
    especialidade?: string;
    prioridade?: string;
    unidade?: string;
    observacoes?: string;
}

export const usePacienteAgendamentos = () => {
    const [agendamentosPaciente, setAgendamentosPaciente] = useState<AgendamentoDTO[]>([]);
    const [loadingAgendamentosPaciente, setLoadingAgendamentosPaciente] = useState(false);

    const buscarAgendamentosPaciente = async (pacienteId: number) => {
        setLoadingAgendamentosPaciente(true);
        try {
            const { data } = await apiService.get(`/agendamentos/paciente/${pacienteId}`);
            setAgendamentosPaciente(data);
        } catch (error) {
            console.error('❌ Erro ao buscar agendamentos do paciente:', error);
            setAgendamentosPaciente([]);
        } finally {
            setLoadingAgendamentosPaciente(false);
        }
    };

    return {
        agendamentosPaciente,
        loadingAgendamentosPaciente,
        buscarAgendamentosPaciente
    };
};