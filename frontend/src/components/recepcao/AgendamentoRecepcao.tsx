import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    Search,
    PlusCircle,
    Clock,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Edit3,
    MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MenuReimpressao from "@/components/agendamento/MenuReimpressao";
import PacienteBusca from '@/components/agendamento/PacienteBusca';
import SeletorExamesMultiplos from '@/components/agendamento/SeletorExamesMultiplos';
import { Paciente } from '@/types/Paciente';
import { AgendamentoDTO, formatarExamesSelecionados } from '@/types/Agendamento';

// Hooks customizados
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useEstatisticas } from '@/hooks/useEstatisticas';
import { useAgendamentoForm } from '@/hooks/useAgendamentoForm';
import { useFeedback } from '@/hooks/useFeedback';
import { usePacienteAgendamentos } from '@/hooks/usePacienteAgendamentos';
import { useAgendamentoOperations } from '@/hooks/useAgendamentoOperations';
import { useAgendamentoSearch } from '@/hooks/useAgendamentoSearch';

const AgendamentoRecepcao: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isNovoAgendamentoOpen, setIsNovoAgendamentoOpen] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<AgendamentoDTO | null>(null);
    const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
    const [novoStatus, setNovoStatus] = useState<string>('');
    // ✅ CORRIGIDO: Definir tipo correto para erroValidacao
    const [erroValidacao, setErroValidacao] = useState<string | any>('');

    // Usando hooks customizados
    const { agendamentos, isLoading, isError, refetch, queryClient } = useAgendamentos(date);
    const estatisticas = useEstatisticas();
    const { mensagemFeedback, mostrarFeedback } = useFeedback();
    const { searchTerm, setSearchTerm, filteredAgendamentos } = useAgendamentoSearch(agendamentos);
    const { agendamentosPaciente, loadingAgendamentosPaciente, buscarAgendamentosPaciente } = usePacienteAgendamentos();
    const { salvarAgendamento, atualizarStatus } = useAgendamentoOperations();

    // ✅ Hook com suporte a múltiplos exames
    const {
        pacienteSelecionado,
        setPacienteSelecionado,
        tipoAtendimento,
        setTipoAtendimento,
        dataHoraAgendamento,
        setDataHoraAgendamento,
        especialidade,
        setEspecialidade,
        examesSelecionados,
        setExamesSelecionados,
        prioridade,
        setPrioridade,
        observacoes,
        setObservacoes,
        resetarFormulario,
        validarAgendamento,
        especialidadesDisponiveis,
        isEspecialidadeObrigatoria,
        getLabelCampoEspecialidade,
        getPlaceholderCampoEspecialidade,
        isExameMultiplo,
        isConsulta
    } = useAgendamentoForm();

    // ✅ FUNÇÃO HELPER para renderizar erros de validação
    const renderizarErroValidacao = (erro: any) => {
        // Se for string simples, retornar direto
        if (typeof erro === 'string') {
            return erro;
        }

        // Se for objeto com estrutura de validação
        if (erro && typeof erro === 'object') {
            return (
                <div className="space-y-2">
                    {erro.valido === false && (
                        <div className="text-red-600 font-medium">❌ Dados inválidos</div>
                    )}

                    {erro.erros && Array.isArray(erro.erros) && erro.erros.length > 0 && (
                        <div>
                            <strong className="text-red-600">Erros:</strong>
                            <ul className="list-disc list-inside ml-4 text-red-600">
                                {erro.erros.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {erro.avisos && Array.isArray(erro.avisos) && erro.avisos.length > 0 && (
                        <div>
                            <strong className="text-yellow-600">Avisos:</strong>
                            <ul className="list-disc list-inside ml-4 text-yellow-600">
                                {erro.avisos.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {erro.sugestoes && Array.isArray(erro.sugestoes) && erro.sugestoes.length > 0 && (
                        <div>
                            <strong className="text-blue-600">Sugestões:</strong>
                            <ul className="list-disc list-inside ml-4 text-blue-600">
                                {erro.sugestoes.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        // Fallback: converter para string
        return String(erro);
    };

    // ✅ HANDLER: Paciente selecionado
    const handlePacienteSelecionado = (paciente: Paciente) => {
        setPacienteSelecionado(paciente);
        buscarAgendamentosPaciente(paciente.id);
    };

    // ✅ HANDLER: Salvar recepcao com SADT
    const handleSalvarAgendamento = async () => {
        setErroValidacao('');

        // Validação completa
        const erro = validarAgendamento();
        if (erro) {
            setErroValidacao(erro);
            return;
        }

        // ✅ PREPARAR DADOS baseado no tipo de atendimentover
        const novoAgendamento = {
            pacienteId: pacienteSelecionado!.id,
            tipo: tipoAtendimento,
            dataHora: new Date(dataHoraAgendamento).toISOString(),
            prioridade,
            observacoes: observacoes.trim() || null,
            unidade: "Unidade Principal",

            // ✅ LÓGICA CONDICIONAL: exames múltiplos OU especialidade
            ...(isExameMultiplo() ? {
                // 📋 Para exames: enviar lista de exames
                examesSelecionados: examesSelecionados,
                especialidade: null
            } : {
                // 🩺 Para consultas: enviar especialidade
                especialidade: especialidade,
                examesSelecionados: []
            })
        };

        console.log('💾 Salvando recepcao:', {
            ...novoAgendamento,
            isExame: isExameMultiplo(),
            isConsulta: isConsulta(),
            totalExames: examesSelecionados.length
        });

        // ✅ SALVAR com lógica completa de SADT
        await salvarAgendamento(
            novoAgendamento,
            queryClient,
            () => {
                // Feedback personalizado
                const tipoMensagem = isExameMultiplo()
                    ? `Agendamento criado! ${examesSelecionados.length} exame(s) selecionado(s). SADT será gerada automaticamente.`
                    : 'Agendamento criado! Comprovante será impresso automaticamente.';

                mostrarFeedback('success', tipoMensagem);

                // Limpar e fechar
                resetarFormulario();
                setIsNovoAgendamentoOpen(false);

                // Atualizar lista do paciente
                if (pacienteSelecionado) {
                    buscarAgendamentosPaciente(pacienteSelecionado.id);
                }
            },
            (error) => {
                console.error('❌ Erro detalhado ao salvar recepcao:', error);
                mostrarFeedback('error', `Erro ao criar agendamento: ${error}`);
            }
        );
    };

    // ✅ HANDLER: Atualizar status
    const handleAtualizarStatus = async () => {
        if (!agendamentoSelecionado || !novoStatus) return;

        await atualizarStatus(
            agendamentoSelecionado.id,
            novoStatus,
            queryClient,
            refetch,
            () => {
                mostrarFeedback('success', 'Status atualizado com sucesso!');
                setIsEditStatusOpen(false);
                setAgendamentoSelecionado(null);
                setNovoStatus('');
            },
            (error: string) => mostrarFeedback('error', error)
        );
    };

    // ✅ HANDLER: Limpar busca
    const limparBusca = () => {
        setPacienteSelecionado(null);
        resetarFormulario();
    };

    // ✅ FUNÇÕES AUXILIARES
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AGENDADO':
                return <Badge variant="default" className="bg-blue-100 text-blue-800">Agendado</Badge>;
            case 'CONFIRMADO':
                return <Badge variant="default" className="bg-green-100 text-green-800">Confirmado</Badge>;
            case 'REALIZADO':
                return <Badge variant="default" className="bg-emerald-100 text-emerald-800">Realizado</Badge>;
            case 'CANCELADO':
                return <Badge variant="destructive">Cancelado</Badge>;
            case 'FALTOU':
                return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Faltou</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatarDataHora = (dataHoraString: string) => {
        const data = new Date(dataHoraString);
        return format(data, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    };

    const formatarHora = (dataHoraString: string) => {
        const data = new Date(dataHoraString);
        return format(data, 'HH:mm', { locale: ptBR });
    };

    const formatarTipoAtendimento = (tipo: string) => {
        const tipos: Record<string, string> = {
            'consulta_medica': 'Consulta Médica',
            'consulta_enfermagem': 'Consulta de Enfermagem',
            'exame_laboratorial': 'Exame Laboratorial',
            'exame_imagem': 'Exame de Imagem',
            'procedimento': 'Procedimento',
            'vacina': 'Vacinação'
        };
        return tipos[tipo] || tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // ✅ FUNÇÃO: Mostrar especialidade ou exames
    const formatarEspecialidadeOuExames = (agendamento: AgendamentoDTO): string => {
        // Se tem exames selecionados, mostrar eles
        if (agendamento.examesSelecionados && agendamento.examesSelecionados.length > 0) {
            return formatarExamesSelecionados(agendamento.examesSelecionados, agendamento.tipo);
        }

        // Senão, mostrar especialidade
        if (agendamento.especialidade) {
            return agendamento.especialidade.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        return '-';
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Agendamentos - Recepção</h2>
                    <p className="text-muted-foreground">
                        Gerencie agendamentos dos pacientes
                    </p>
                </div>
            </div>

            {/* Feedback Visual */}
            {mensagemFeedback.tipo && (
                <Alert className={mensagemFeedback.tipo === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {mensagemFeedback.tipo === 'success' ?
                        <CheckCircle className="h-4 w-4 text-green-600" /> :
                        <XCircle className="h-4 w-4 text-red-600" />
                    }
                    <AlertDescription className={mensagemFeedback.tipo === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {mensagemFeedback.texto}
                    </AlertDescription>
                </Alert>
            )}

            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{estatisticas?.total || 0}</div>
                        <p className="text-xs text-muted-foreground">agendamentos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agendados</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{estatisticas?.agendados || 0}</div>
                        <p className="text-xs text-muted-foreground">aguardando</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{estatisticas?.confirmados || 0}</div>
                        <p className="text-xs text-muted-foreground">confirmados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Realizados</CardTitle>
                        <User className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{estatisticas?.realizados || 0}</div>
                        <p className="text-xs text-muted-foreground">atendidos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{estatisticas?.cancelados || 0}</div>
                        <p className="text-xs text-muted-foreground">cancelados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Busca de Paciente */}
            <Card>
                <CardHeader>
                    <CardTitle>Busca de Paciente e Agendamentos</CardTitle>
                    <CardDescription>Busque um paciente para visualizar ou criar agendamentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Buscar Paciente
                            </h3>
                            {pacienteSelecionado && (
                                <Button variant="outline" size="sm" onClick={limparBusca}>
                                    Limpar Busca
                                </Button>
                            )}
                        </div>

                        <PacienteBusca
                            onPacienteSelecionado={handlePacienteSelecionado}
                            placeholder="Digite o nome ou CPF do paciente para buscar agendamentos..."
                        />
                    </div>

                    {/* Agendamentos do Paciente Selecionado */}
                    {pacienteSelecionado && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-green-600" />
                                    Agendamentos de {pacienteSelecionado.nomeCompleto}
                                </h3>

                                {/* ✅ MODAL NOVO AGENDAMENTO CORRIGIDO */}
                                <Dialog open={isNovoAgendamentoOpen} onOpenChange={(open) => {
                                    setIsNovoAgendamentoOpen(open);
                                    if (!open) resetarFormulario();
                                }}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Novo Agendamento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Novo Agendamento</DialogTitle>
                                            <DialogDescription>
                                                Criar agendamento para {pacienteSelecionado.nomeCompleto}
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* ✅ CORRIGIDO: Renderização segura de erros de validação */}
                                        {erroValidacao && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-800">
                                                    {renderizarErroValidacao(erroValidacao)}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="grid gap-6 py-4">
                                            {/* Tipo de Atendimento */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="tipo">Tipo de Atendimento</Label>
                                                <Select value={tipoAtendimento} onValueChange={setTipoAtendimento}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="consulta_medica">Consulta Médica</SelectItem>
                                                        <SelectItem value="consulta_enfermagem">Consulta de Enfermagem</SelectItem>
                                                        <SelectItem value="exame_laboratorial">Exame Laboratorial</SelectItem>
                                                        <SelectItem value="exame_imagem">Exame de Imagem</SelectItem>
                                                        <SelectItem value="procedimento">Procedimento</SelectItem>
                                                        <SelectItem value="vacina">Vacinação</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* ✅ Campo Especialidade ou Exames */}
                                            {tipoAtendimento && (
                                                <div className="grid gap-2">
                                                    <Label htmlFor="especialidade">
                                                        {getLabelCampoEspecialidade()}
                                                        {isEspecialidadeObrigatoria() && ' *'}
                                                    </Label>

                                                    {/* Para consultas - Select de especialidade */}
                                                    {isConsulta() && (
                                                        <Select value={especialidade} onValueChange={setEspecialidade}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={getPlaceholderCampoEspecialidade()} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {especialidadesDisponiveis.map((esp) => (
                                                                    <SelectItem key={esp.value} value={esp.value}>
                                                                        {esp.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}

                                                    {/* Para exames - Seletor múltiplo */}
                                                    {isExameMultiplo() && (
                                                        <SeletorExamesMultiplos
                                                            tipoExame={tipoAtendimento as 'exame_laboratorial' | 'exame_imagem'}
                                                            examesSelecionados={examesSelecionados}
                                                            onExamesChange={setExamesSelecionados}
                                                            placeholder={getPlaceholderCampoEspecialidade()}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Data e Hora */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="dataHora">Data e Hora</Label>
                                                <Input
                                                    id="dataHora"
                                                    type="datetime-local"
                                                    value={dataHoraAgendamento}
                                                    onChange={(e) => setDataHoraAgendamento(e.target.value)}
                                                />
                                            </div>

                                            {/* Prioridade */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="prioridade">Prioridade</Label>
                                                <Select value={prioridade} onValueChange={setPrioridade}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="urgente">Urgente</SelectItem>
                                                        <SelectItem value="emergencia">Emergência</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Observações */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="observacoes">Observações</Label>
                                                <Textarea
                                                    id="observacoes"
                                                    placeholder="Observações adicionais..."
                                                    value={observacoes}
                                                    onChange={(e) => setObservacoes(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsNovoAgendamentoOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleSalvarAgendamento}>
                                                Salvar Agendamento
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Lista de Agendamentos do Paciente */}
                            {loadingAgendamentosPaciente ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Carregando agendamentos...</span>
                                </div>
                            ) : agendamentosPaciente.length > 0 ? (
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Data/Hora</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Especialidade/Exames</TableHead>
                                                <TableHead>Observações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...agendamentosPaciente]
                                                .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
                                                .map((agendamento) => (
                                                    <TableRow key={agendamento.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                {formatarDataHora(agendamento.dataHora)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatarTipoAtendimento(agendamento.tipo)}</TableCell>
                                                        <TableCell>{getStatusBadge(agendamento.status)}</TableCell>
                                                        <TableCell>
                                                            {formatarEspecialidadeOuExames(agendamento)}
                                                        </TableCell>
                                                        <TableCell className="max-w-xs">
                                                            <span className="text-sm text-gray-600 truncate">
                                                                {agendamento.observacoes || '-'}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Este paciente não possui agendamentos cadastrados.
                                        <br />
                                        <span
                                            className="text-blue-600 cursor-pointer hover:underline"
                                            onClick={() => setIsNovoAgendamentoOpen(true)}
                                        >
                                            Clique aqui para criar o primeiro agendamento.
                                        </span>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Agenda do Dia */}
            <Card>
                <CardHeader>
                    <CardTitle>Agenda do Dia</CardTitle>
                    <CardDescription>Visualize todos os agendamentos por data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex-grow flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <div className="relative flex-grow">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por paciente, tipo ou especialidade..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3">Carregando agendamentos...</span>
                        </div>
                    )}

                    {isError && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-600">
                                Erro ao buscar agendamentos. Tente novamente.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Horário</TableHead>
                                    <TableHead>Paciente</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Especialidade/Exames</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAgendamentos && filteredAgendamentos.length > 0 ? (
                                    [...filteredAgendamentos]
                                        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                                        .map(agendamento => (
                                            <TableRow key={agendamento.id}>
                                                <TableCell className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    {formatarHora(agendamento.dataHora)}
                                                </TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                    {agendamento.pacienteNome}
                                                </TableCell>
                                                <TableCell>{formatarTipoAtendimento(agendamento.tipo)}</TableCell>
                                                <TableCell>{getStatusBadge(agendamento.status)}</TableCell>
                                                <TableCell>
                                                    {formatarEspecialidadeOuExames(agendamento)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setAgendamentoSelecionado(agendamento);
                                                                    setIsEditStatusOpen(true);
                                                                }}
                                                            >
                                                                <Edit3 className="mr-2 h-4 w-4" />
                                                                Editar Status
                                                            </DropdownMenuItem>
                                                            <MenuReimpressao agendamento={agendamento} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            {date ? (
                                                searchTerm ?
                                                    `Nenhum agendamento encontrado para "${searchTerm}" em ${format(date, 'dd/MM/yyyy', { locale: ptBR })}.` :
                                                    `Nenhum agendamento encontrado para ${format(date, 'dd/MM/yyyy', { locale: ptBR })}.`
                                            ) : (
                                                'Selecione uma data para visualizar os agendamentos.'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal para Alterar Status */}
            <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alterar Status do Agendamento</DialogTitle>
                        <DialogDescription>
                            {agendamentoSelecionado && (
                                <>
                                    Paciente: {agendamentoSelecionado.pacienteNome}<br />
                                    Data/Hora: {formatarDataHora(agendamentoSelecionado.dataHora)}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="novoStatus">Novo Status</Label>
                            <Select value={novoStatus} onValueChange={setNovoStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o novo status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AGENDADO">Agendado</SelectItem>
                                    <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                                    <SelectItem value="REALIZADO">Realizado</SelectItem>
                                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                    <SelectItem value="FALTOU">Faltou</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditStatusOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAtualizarStatus}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgendamentoRecepcao;