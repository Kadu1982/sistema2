import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AgendamentoRecepcao from '@/components/recepcao/AgendamentoRecepcao';

// Importação do componente de cadastro com busca
import CadastroPacienteComAutoComplete, { CadastroPacienteFormDataType } from '@/components/pacientes/CadastroPacienteComAutoComplete';
import { toast } from '@/components/ui/use-toast';
import { createPaciente } from '@/services/pacienteService'; // Importar a função de criar

const Recepcao: React.FC = () => {
    const navigate = useNavigate();
    const { tab } = useParams<{ tab?: string }>();

    const activeTab = tab || 'agendamento';

    const handleTabChange = (value: string) => {
        navigate(`/recepcao/${value}`);
    };

    // Função para lidar com o submit do formulário de paciente
    const handlePacienteSubmit = async (data: CadastroPacienteFormDataType) => {
        console.log("Dados do paciente recebidos para criação:", data);
        try {
            // ✅ CONECTANDO A FUNCIONALIDADE: Chama o serviço para criar o paciente
            const novoPaciente = await createPaciente(data as any); // 'as any' pode ser necessário se os tipos não baterem 100%
            toast({
                title: "Sucesso!",
                description: `Paciente "${novoPaciente.nomeCompleto}" cadastrado com sucesso.`,
                className: "bg-green-100 text-green-800",
            });
            // Após o sucesso, navega para a página de gerenciamento para ver o novo cadastro
            navigate('/pacientes');
        } catch (error: any) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível salvar o paciente.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Painel da Recepção</CardTitle>
                    <CardDescription>
                        Gerencie agendamentos, cadastros e o fluxo de atendimento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="agendamento">Agendamento do Dia</TabsTrigger>
                            <TabsTrigger value="cadastro">Cadastro de Pacientes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="agendamento" className="mt-4">
                            <AgendamentoRecepcao />
                        </TabsContent>

                        <TabsContent value="cadastro" className="mt-4">
                            {/* ✅ ESTRUTURA CORRIGIDA */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-1">
                                    <div>
                                        <h3 className="text-lg font-semibold">Busca Rápida e Novo Cadastro</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Use a busca para encontrar um paciente ou preencha para criar um novo.
                                        </p>
                                    </div>
                                    {/* ✅ BOTÃO RESTAURADO: Leva para a página de gerenciamento completo */}
                                    <Button variant="outline" onClick={() => navigate('/pacientes')}>
                                        <Search className="mr-2 h-4 w-4" />
                                        Gerenciar Todos os Pacientes
                                    </Button>
                                </div>
                                <Separator />
                                {/* ✅ COMPONENTE DE BUSCA MANTIDO */}
                                <CadastroPacienteComAutoComplete
                                    onSubmit={handlePacienteSubmit}
                                    onCancel={() => console.log("Ação de cancelar clicada")}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Recepcao;