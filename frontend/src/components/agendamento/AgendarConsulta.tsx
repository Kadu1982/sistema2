import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { toast } from '@/hooks/use-toast.ts';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    AlertCircle,
    CheckCircle,
    Search,
    FileText
} from 'lucide-react';

// Componentes internos
// ✅ CORREÇÃO 1: Import default em vez de named import
import LayoutAgendamento from './shared/LayoutAgendamento';
import { PacienteBusca } from './PacienteBusca.tsx';
import { EspecialidadeField } from './consulta/EspecialidadeField';
import { UnidadeField } from './consulta/UnidadeField';
import { ProfissionalField } from './consulta/ProfissionalField';
import { DataHorarioFields } from './shared/DataHorarioFields';
import { PrioridadeField } from './shared/PrioridadeField';
import { FormActions } from './shared/FormActions';

// Hooks e serviços
import { usePacienteBusca } from '@/hooks/usePacienteBusca.ts';
import { useAgendamentoForm } from '@/hooks/useAgendamentoForm.ts';
import { agendamentoService } from '@/services/agendamentoService.ts';

// Tipos
import { Paciente } from '@/types/Paciente.ts';
// ✅ CORREÇÃO 2: Usar AgendamentoDTO em vez de Agendamento
import { AgendamentoDTO } from '@/types/Agendamento.ts';

export const AgendarConsulta: React.FC = () => {
    const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
    const [showBuscaPaciente, setShowBuscaPaciente] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Hook para busca de pacientes
    const {
        pacientes,
        isLoading: isBuscandoPaciente,
        buscarPaciente
    } = usePacienteBusca();

    // Formulário de agendamento
    const {
        formData,
        setFormData,
        resetForm,
        validateForm,
        errors
    } = useAgendamentoForm();

    // Limpar erro quando formulário mudar
    useEffect(() => {
        if (errorMessage) {
            setErrorMessage('');
        }
    }, [formData]);

    // Função para selecionar paciente
    const handleSelecionarPaciente = (paciente: Paciente) => {
        setPacienteSelecionado(paciente);
        setFormData(prev => ({
            ...prev,
            pacienteId: paciente.id || 0
        }));
        setShowBuscaPaciente(false);
    };

    // Função para trocar paciente
    const handleTrocarPaciente = () => {
        setPacienteSelecionado(null);
        setFormData(prev => ({
            ...prev,
            pacienteId: 0
        }));
        setShowBuscaPaciente(true);
    };

    // Função para submeter o agendamento
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pacienteSelecionado) {
            toast({
                title: "❌ Erro",
                description: "Selecione um paciente primeiro",
                variant: "destructive"
            });
            return;
        }

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrorMessage("Preencha todos os campos obrigatórios");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // Preparar dados para o backend
            const dataHorario = `${formData.data}T${formData.horario}:00`;

            // ✅ CORREÇÃO 3: Garantir que pacienteId seja number
            const pacienteId = pacienteSelecionado.id;
            if (!pacienteId || typeof pacienteId !== 'number') {
                throw new Error('ID do paciente inválido');
            }

            const agendamentoData = {
                pacienteId, // ✅ Agora é garantido que é number
                tipo: 'consulta_medica',
                dataHora: dataHorario,
                especialidade: formData.especialidade,
                prioridade: formData.prioridade,
                unidade: formData.unidade,
                observacoes: formData.observacoes || '',
                examesSelecionados: [] // Consulta não tem exames
            };

            console.log('📤 Enviando agendamento:', agendamentoData);

            // Enviar para o backend
            const response = await agendamentoService.criarAgendamento(agendamentoData);

            console.log('✅ Agendamento criado:', response);

            // Sucesso
            toast({
                title: "✅ Sucesso!",
                description: `Consulta agendada para ${new Date(dataHorario).toLocaleString('pt-BR')}`,
                variant: "default"
            });

            // Reset do formulário
            resetForm();
            setPacienteSelecionado(null);
            setShowBuscaPaciente(true);

        } catch (error: any) {
            console.error('❌ Erro ao agendar consulta:', error);

            const errorMsg = error.response?.data?.message ||
                error.message ||
                'Erro interno do servidor';

            setErrorMessage(errorMsg);

            toast({
                title: "❌ Erro ao agendar",
                description: errorMsg,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LayoutAgendamento
            title="Agendar Consulta Médica"
            subtitle="Agendamento de consultas médicas para pacientes"
            isLoading={isSubmitting}
            errorMessage={errorMessage}
            paciente={pacienteSelecionado ? {
                nome: pacienteSelecionado.nome,
                cartaoSus: pacienteSelecionado.cartaoSus,
                dataNascimento: pacienteSelecionado.dataNascimento
            } : undefined}
        >
            {/* 1. Busca de Paciente */}
            {showBuscaPaciente && (
                <PacienteBusca
                    onSelecionarPaciente={handleSelecionarPaciente}
                    isLoading={isBuscandoPaciente}
                />
            )}

            {/* 2. Formulário de Agendamento */}
            {pacienteSelecionado && !showBuscaPaciente && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Dados do Agendamento
              </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTrocarPaciente}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Trocar Paciente
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Especialidade */}
                                <EspecialidadeField
                                    value={formData.especialidade}
                                    onChange={(value) => setFormData(prev => ({ ...prev, especialidade: value }))}
                                    error={errors.especialidade}
                                />

                                {/* Unidade */}
                                <UnidadeField
                                    value={formData.unidade}
                                    onChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}
                                    error={errors.unidade}
                                />

                                {/* Profissional */}
                                <ProfissionalField
                                    especialidade={formData.especialidade}
                                    unidade={formData.unidade}
                                    value={formData.profissional || ''}
                                    onChange={(value) => setFormData(prev => ({ ...prev, profissional: value }))}
                                    error={errors.profissional}
                                />

                                {/* Prioridade */}
                                <PrioridadeField
                                    value={formData.prioridade}
                                    onChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}
                                    error={errors.prioridade}
                                />
                            </div>

                            {/* Data e Horário */}
                            <DataHorarioFields
                                data={formData.data}
                                horario={formData.horario}
                                onDataChange={(value) => setFormData(prev => ({ ...prev, data: value }))}
                                onHorarioChange={(value) => setFormData(prev => ({ ...prev, horario: value }))}
                                errors={{
                                    data: errors.data,
                                    horario: errors.horario
                                }}
                            />

                            {/* Observações */}
                            <div className="space-y-2">
                                <Label htmlFor="observacoes" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Observações (opcional)
                                </Label>
                                <Textarea
                                    id="observacoes"
                                    placeholder="Observações adicionais para o agendamento..."
                                    value={formData.observacoes || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            {/* Ações */}
                            <FormActions
                                onCancel={handleTrocarPaciente}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                submitText="Agendar Consulta"
                            />
                        </form>
                    </CardContent>
                </Card>
            )}
        </LayoutAgendamento>
    );
};