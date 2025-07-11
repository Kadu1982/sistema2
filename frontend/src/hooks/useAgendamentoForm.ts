import { useState } from 'react';

export interface AgendamentoFormData {
    pacienteId: number;
    especialidade: string;
    unidade: string;
    profissional?: string;
    prioridade: string;
    data: string;
    horario: string;
    observacoes?: string;
}

export interface AgendamentoFormErrors {
    pacienteId?: string;
    especialidade?: string;
    unidade?: string;
    profissional?: string;
    prioridade?: string;
    data?: string;
    horario?: string;
}

export const useAgendamentoForm = () => {
    const [formData, setFormData] = useState<AgendamentoFormData>({
        pacienteId: 0,
        especialidade: '',
        unidade: '',
        profissional: '',
        prioridade: '',
        data: '',
        horario: '',
        observacoes: ''
    });

    const [errors, setErrors] = useState<AgendamentoFormErrors>({});

    const validateForm = (): AgendamentoFormErrors => {
        const newErrors: AgendamentoFormErrors = {};

        if (!formData.pacienteId || formData.pacienteId === 0) {
            newErrors.pacienteId = 'Selecione um paciente';
        }

        if (!formData.especialidade.trim()) {
            newErrors.especialidade = 'Especialidade é obrigatória';
        }

        if (!formData.unidade.trim()) {
            newErrors.unidade = 'Unidade é obrigatória';
        }

        if (!formData.prioridade.trim()) {
            newErrors.prioridade = 'Prioridade é obrigatória';
        }

        if (!formData.data.trim()) {
            newErrors.data = 'Data é obrigatória';
        } else {
            const dataAgendamento = new Date(formData.data);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (dataAgendamento < hoje) {
                newErrors.data = 'Data não pode ser anterior a hoje';
            }
        }

        if (!formData.horario.trim()) {
            newErrors.horario = 'Horário é obrigatório';
        }

        setErrors(newErrors);
        return newErrors;
    };

    const resetForm = () => {
        setFormData({
            pacienteId: 0,
            especialidade: '',
            unidade: '',
            profissional: '',
            prioridade: '',
            data: '',
            horario: '',
            observacoes: ''
        });
        setErrors({});
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        validateForm,
        resetForm
    };
};