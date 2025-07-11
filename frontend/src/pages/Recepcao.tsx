import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import AgendamentoRecepcao from '@/components/recepcao/AgendamentoRecepcao';

const CadastroTabContent: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-6 flex flex-col items-start gap-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold">Ações de Paciente</h3>
            <p className="text-sm text-muted-foreground">
                Adicione um novo paciente ao sistema ou busque por cadastros existentes na base de dados.
            </p>
            <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate('/pacientes/novo')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Paciente
                </Button>
                <Button variant="outline" onClick={() => navigate('/pacientes')}>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar e Gerenciar Pacientes
                </Button>
            </div>
        </div>
    );
};

const Recepcao: React.FC = () => {
    const navigate = useNavigate();
    const { tab } = useParams<{ tab?: string }>();

    const activeTab = tab || 'agendamento';

    const handleTabChange = (value: string) => {
        navigate(`/recepcao/${value}`);
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
                            <CadastroTabContent />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Recepcao;