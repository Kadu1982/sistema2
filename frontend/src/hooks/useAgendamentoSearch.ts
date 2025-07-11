import { useState, useMemo } from 'react';

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

export const useAgendamentoSearch = (agendamentos: AgendamentoDTO[] | undefined) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgendamentos = useMemo(() => {
        if (!agendamentos || !Array.isArray(agendamentos)) return [];
        return agendamentos.filter(agendamento =>
            agendamento.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agendamento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (agendamento.especialidade && agendamento.especialidade.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [agendamentos, searchTerm]);

    return { searchTerm, setSearchTerm, filteredAgendamentos };
};
