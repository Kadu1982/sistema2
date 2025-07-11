import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    User,
    Calendar,
    Phone,
    Mail,
    MapPin,
    FileText,
    ClipboardCheck,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// Types and Hooks
import { AgendamentoDTO, formatarTipoAtendimento } from '@/types/Agendamento';
import { useAtendimentos } from '@/hooks/useAtendimentos';
import { atendimentoService, Atendimento } from '@/services/atendimento/AtendimentoService';
import apiService from '@/services/apiService';

// Define interfaces for the component
interface PacienteDetalhesProps {
    pacienteId: string;
    agendamento: AgendamentoDTO;
    onClose: () => void;
}

interface Paciente {
    id: number;
    nomeCompleto: string;
    dataNascimento: string;
    cpf: string;
    cartaoSus: string;
    telefone: string;
    email: string;
    endereco: {
        logradouro: string;
        numero: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };
}

interface Exame {
    id: string;
    nome: string;
    tipo: string;
    dataRequisicao: string;
    dataRealizacao?: string;
    status: 'PENDENTE' | 'REALIZADO' | 'CANCELADO';
    resultado?: string;
}

export const PacienteDetalhes: React.FC<PacienteDetalhesProps> = ({ pacienteId, agendamento, onClose }) => {
    const { toast } = useToast();
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [exames, setExames] = useState<Exame[]>([]);
    const [loading, setLoading] = useState({
        paciente: true,
        exames: true
    });
    const [error, setError] = useState({
        paciente: false,
        exames: false
    });

    // Fetch patient data
    useEffect(() => {
        const fetchPaciente = async () => {
            // Skip API call if pacienteId is empty or invalid
            if (!pacienteId || pacienteId === '') {
                console.log('ID do paciente inválido ou vazio, pulando chamada de API');
                setError(prev => ({ ...prev, paciente: true }));
                setLoading(prev => ({ ...prev, paciente: false }));
                return;
            }

            try {
                const { data } = await apiService.get(`/pacientes/${pacienteId}`);
                setPaciente(data);
                setLoading(prev => ({ ...prev, paciente: false }));
                // Reset error state if successful
                setError(prev => ({ ...prev, paciente: false }));
            } catch (err: any) {
                console.error('Erro ao buscar dados do paciente:', err);
                setError(prev => ({ ...prev, paciente: true }));
                setLoading(prev => ({ ...prev, paciente: false }));

                // Log specific error information for debugging
                if (err.response) {
                    console.log(`Status: ${err.response.status}, Message: ${err.message}`);

                    // Handle specific error codes
                    if (err.response.status === 403) {
                        toast({
                            title: "Erro de permissão",
                            description: "Você não tem permissão para acessar os dados deste paciente.",
                            variant: "destructive"
                        });
                    } else if (err.response.status === 404) {
                        toast({
                            title: "Paciente não encontrado",
                            description: "O paciente com o ID informado não foi encontrado no sistema.",
                            variant: "destructive"
                        });
                    } else {
                        toast({
                            title: "Erro ao buscar paciente",
                            description: "Ocorreu um erro ao buscar os dados do paciente. Tente novamente mais tarde.",
                            variant: "destructive"
                        });
                    }
                }
            }
        };

        fetchPaciente();
    }, [pacienteId, toast]);

    // Fetch exams data
    useEffect(() => {
        const fetchExames = async () => {
            // Skip API call if pacienteId is empty or invalid
            if (!pacienteId || pacienteId === '') {
                console.log('ID do paciente inválido ou vazio, pulando busca de exames');
                setError(prev => ({ ...prev, exames: true }));
                setLoading(prev => ({ ...prev, exames: false }));
                return;
            }

            try {
                const { data } = await apiService.get(`/exames/paciente/${pacienteId}`);
                setExames(data || []);
                setLoading(prev => ({ ...prev, exames: false }));
                // Reset error state if successful
                setError(prev => ({ ...prev, exames: false }));
            } catch (err: any) {
                console.error('Erro ao buscar exames do paciente:', err);
                setError(prev => ({ ...prev, exames: true }));
                setLoading(prev => ({ ...prev, exames: false }));

                // Log specific error information for debugging
                if (err.response) {
                    console.log(`Status: ${err.response.status}, Message: ${err.message}`);

                    // If it's a 403 error, it might be a permissions issue
                    if (err.response.status === 403) {
                        toast({
                            title: "Erro de permissão",
                            description: "Você não tem permissão para acessar os exames deste paciente.",
                            variant: "destructive"
                        });
                    }
                }
            }
        };

        fetchExames();
    }, [pacienteId, toast]);

    // Get patient's previous appointments
    const { data: atendimentos, isLoading: loadingAtendimentos, isError: errorAtendimentos } = useAtendimentos(pacienteId);

    // Format date
    const formatarData = (dataString: string) => {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return format(data, 'dd/MM/yyyy', { locale: ptBR });
    };

    // Format date and time
    const formatarDataHora = (dataString: string) => {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return format(data, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    };

    // Calculate age from birth date
    const calcularIdade = (dataNascimento: string) => {
        if (!dataNascimento) return '';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return `${idade} anos`;
    };

    // Get status badge for exams
    const getStatusExameBadge = (status: string) => {
        switch (status) {
            case 'PENDENTE':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
            case 'REALIZADO':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Realizado</Badge>;
            case 'CANCELADO':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Start attendance
    const iniciarAtendimento = async () => {
        try {
            // Skip if pacienteId is invalid
            if (!pacienteId || pacienteId === '') {
                console.error('ID do paciente inválido ou vazio, não é possível iniciar atendimentover');
                toast({
                    title: "Erro ao iniciar atendimentover",
                    description: "ID do paciente inválido ou vazio. Não é possível iniciar o atendimentover.",
                    variant: "destructive"
                });
                return;
            }

            // Skip if there's an error with patient data
            if (error.paciente) {
                toast({
                    title: "Erro ao iniciar atendimentover",
                    description: "Não foi possível carregar os dados do paciente. Verifique se o paciente existe e tente novamente.",
                    variant: "destructive"
                });
                return;
            }

            // Create a new attendance record
            const novoAtendimento = {
                pacienteId: pacienteId,
                cid10: '', // Will be filled during attendance
                diagnostico: '', // Will be filled during attendance
                prescricao: '', // Will be filled during attendance
            };

            try {
                // Update appointment status to EM_ATENDIMENTO
                await apiService.patch(`/agendamentos/${agendamento.id}/status`, { 
                    status: 'EM_ATENDIMENTO' 
                });

                toast({
                    title: "Atendimento iniciado",
                    description: "O atendimentover foi iniciado com sucesso.",
                    variant: "default"
                });

                // Close the dialog and refresh the appointments list
                onClose();
            } catch (statusError: any) {
                console.error('Erro ao atualizar status do recepcao:', statusError);

                // Handle specific error codes
                if (statusError.response?.status === 403) {
                    toast({
                        title: "Erro de permissão",
                        description: "Você não tem permissão para iniciar este atendimentover. Verifique suas credenciais ou entre em contato com o administrador.",
                        variant: "destructive"
                    });
                } else if (statusError.response?.status === 404) {
                    toast({
                        title: "Agendamento não encontrado",
                        description: "O recepcao selecionado não foi encontrado no sistema.",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Erro ao atualizar status",
                        description: "Não foi possível atualizar o status do recepcao. Tente novamente mais tarde.",
                        variant: "destructive"
                    });
                }
            }
        } catch (err) {
            console.error('Erro ao iniciar atendimentover:', err);
            toast({
                title: "Erro ao iniciar atendimentover",
                description: "Ocorreu um erro ao tentar iniciar o atendimentover. Tente novamente mais tarde.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Patient basic information */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Dados do Paciente</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading.paciente ? (
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-3">Carregando dados do paciente...</span>
                        </div>
                    ) : error.paciente ? (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-600">
                                Erro ao carregar dados do paciente. Verifique se o ID do paciente é válido ou tente novamente mais tarde.
                                {(!pacienteId || pacienteId === '') && (
                                    <div className="mt-2 font-semibold">
                                        ID do paciente não fornecido ou inválido.
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    ) : paciente ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Nome:</span> {paciente.nomeCompleto}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Data de Nascimento:</span> {formatarData(paciente.dataNascimento)} ({calcularIdade(paciente.dataNascimento)})
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">CPF:</span> {paciente.cpf}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Cartão SUS:</span> {paciente.cartaoSus}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Telefone:</span> {paciente.telefone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Email:</span> {paciente.email || '-'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold">Endereço:</span> {paciente.endereco ? 
                                        `${paciente.endereco.logradouro}, ${paciente.endereco.numero} - ${paciente.endereco.bairro}, ${paciente.endereco.cidade}/${paciente.endereco.uf}` : 
                                        '-'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">Nenhum dado encontrado para o paciente.</div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs for appointments and exams */}
            <Tabs defaultValue="atendimentos">
                <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="atendimentos">Histórico de Atendimentos</TabsTrigger>
                    <TabsTrigger value="exames">Exames</TabsTrigger>
                </TabsList>

                {/* Previous appointments tab */}
                <TabsContent value="atendimentos">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Histórico de Atendimentos</CardTitle>
                            <CardDescription>Atendimentos anteriores do paciente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingAtendimentos ? (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="ml-3">Carregando histórico de atendimentos...</span>
                                </div>
                            ) : errorAtendimentos ? (
                                <Alert className="bg-red-50 border-red-200">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-600">
                                        Erro ao carregar histórico de atendimentos. Verifique se o ID do paciente é válido ou tente novamente mais tarde.
                                        {(!pacienteId || pacienteId === '') && (
                                            <div className="mt-2 font-semibold">
                                                ID do paciente não fornecido ou inválido.
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            ) : atendimentos && atendimentos.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Data</TableHead>
                                                <TableHead>CID</TableHead>
                                                <TableHead>Diagnóstico</TableHead>
                                                <TableHead>Prescrição</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {atendimentos.map((atendimento) => (
                                                <TableRow key={atendimento.id}>
                                                    <TableCell>{formatarDataHora(atendimento.dataHora)}</TableCell>
                                                    <TableCell>{atendimento.cid10}</TableCell>
                                                    <TableCell>{atendimento.diagnostico}</TableCell>
                                                    <TableCell>{atendimento.prescricao}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-4">Nenhum atendimento anterior encontrado.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Exams tab */}
                <TabsContent value="exames">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Exames</CardTitle>
                            <CardDescription>Exames solicitados e resultados</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading.exames ? (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="ml-3">Carregando exames...</span>
                                </div>
                            ) : error.exames ? (
                                <Alert className="bg-red-50 border-red-200">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-600">
                                        Erro ao carregar exames do paciente. Verifique se o ID do paciente é válido ou tente novamente mais tarde.
                                        {(!pacienteId || pacienteId === '') && (
                                            <div className="mt-2 font-semibold">
                                                ID do paciente não fornecido ou inválido.
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            ) : exames.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Exame</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Data Requisição</TableHead>
                                                <TableHead>Data Realização</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Resultado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {exames.map((exame) => (
                                                <TableRow key={exame.id}>
                                                    <TableCell>{exame.nome}</TableCell>
                                                    <TableCell>{exame.tipo}</TableCell>
                                                    <TableCell>{formatarData(exame.dataRequisicao)}</TableCell>
                                                    <TableCell>{exame.dataRealizacao ? formatarData(exame.dataRealizacao) : '-'}</TableCell>
                                                    <TableCell>{getStatusExameBadge(exame.status)}</TableCell>
                                                    <TableCell>
                                                        {exame.status === 'REALIZADO' && exame.resultado ? (
                                                            <Button variant="outline" size="sm">
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                Ver Resultado
                                                            </Button>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-4">Nenhum exame encontrado.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Current appointment information */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Agendamento Atual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">Data/Hora:</span> {formatarDataHora(agendamento.dataHora)}
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">Tipo:</span> {formatarTipoAtendimento(agendamento.tipo)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">Profissional:</span> {agendamento.profissionalNome || '-'}
                            </div>
                            <div className="flex items-center gap-2">
                                <ClipboardCheck className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">Especialidade:</span> {agendamento.especialidade ? 
                                    agendamento.especialidade.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                                    (agendamento.examesSelecionados && agendamento.examesSelecionados.length > 0 ? 
                                        `${agendamento.examesSelecionados.join(', ')}` : '-')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>
                    Fechar
                </Button>
                <Button 
                    onClick={iniciarAtendimento} 
                    disabled={!pacienteId || pacienteId === '' || error.paciente || loading.paciente}
                    title={!pacienteId || pacienteId === '' || error.paciente ? 'Não é possível iniciar atendimentover sem dados válidos do paciente' : ''}
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Iniciar Atendimento
                </Button>
            </div>
        </div>
    );
};
