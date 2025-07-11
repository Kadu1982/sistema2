// src/components/atendimentover/AtendimentoForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PacienteBusca from "@/components/agendamento/PacienteBusca";
import CidBusca from "@/components/atendimento/CidBusca";
import { Paciente } from "@/types/Paciente";
import { Cid } from "@/types/Cid";
import { useState } from "react";

// ANOTAÇÃO: Define a estrutura e as regras de validação para os dados do formulário de atendimentover.
const atendimentoSchema = z.object({
    pacienteId: z.string().min(1, "O campo Paciente é obrigatório."),
    anamnese: z.string().min(10, "A anamnese deve ter pelo menos 10 caracteres."),
    cid10: z.string().min(1, "O campo CID é obrigatório."),
    diagnostico: z.string().min(5, "O diagnóstico deve ter pelo menos 5 caracteres."),
    prescricao: z.string().optional(),
    solicitacaoExames: z.string().optional(),
});

// ANOTAÇÃO: Define o tipo de dados que o formulário manipula, inferido diretamente do schema.
export type AtendimentoFormData = z.infer<typeof atendimentoSchema>;

// ANOTAÇÃO: Define as propriedades que o componente 'AtendimentoForm' espera receber.
interface AtendimentoFormProps {
    onSave: (data: AtendimentoFormData) => void; // Uma função para ser chamada quando o formulário for salvo.
    isLoading?: boolean; // Um booleano para controlar o estado de carregamento (ex: desabilitar o botão).
    title: string;
    description: string;
}

export const AtendimentoForm = ({ onSave, isLoading, title, description }: AtendimentoFormProps) => {
    // Estados para armazenar o paciente e CID selecionados
    const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
    const [cidSelecionado, setCidSelecionado] = useState<Cid | null>(null);

    // ANOTAÇÃO: Inicializa o react-hook-form com nosso schema de validação (Zod).
    const form = useForm<AtendimentoFormData>({
        resolver: zodResolver(atendimentoSchema),
        defaultValues: {
            pacienteId: "",
            anamnese: "",
            cid10: "",
            diagnostico: "",
            prescricao: "",
            solicitacaoExames: "",
        },
    });

    // Função para lidar com a seleção de paciente
    const handlePacienteSelecionado = (paciente: Paciente | null) => {
        setPacienteSelecionado(paciente);
        if (paciente) {
            form.setValue('pacienteId', paciente.id.toString());
        } else {
            form.setValue('pacienteId', '');
        }
    };

    // Função para lidar com a seleção de CID
    const handleCidSelecionado = (cid: Cid | null) => {
        setCidSelecionado(cid);
        if (cid) {
            form.setValue('cid10', cid.codigo);
            // Preenche o campo de diagnóstico com a descrição do CID se estiver vazio
            const currentDiagnostico = form.getValues('diagnostico');
            if (!currentDiagnostico || currentDiagnostico.trim() === '') {
                form.setValue('diagnostico', cid.descricao);
            }
        } else {
            form.setValue('cid10', '');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* ANOTAÇÃO: O provedor de formulário que conecta nossa UI com a lógica do react-hook-form. */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                        {/* ANOTAÇÃO: Cada campo do formulário agora é um 'FormField' controlado, garantindo integração e validação. */}
                        <FormField
                            control={form.control}
                            name="pacienteId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <PacienteBusca 
                                            onPacienteSelecionado={handlePacienteSelecionado}
                                            pacienteSelecionado={pacienteSelecionado}
                                            placeholder="Digite o nome ou CPF do paciente"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="anamnese"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Anamnese</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Descreva os sintomas e histórico do paciente..." {...field} rows={5} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cid10"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <CidBusca 
                                            onCidSelecionado={handleCidSelecionado}
                                            cidSelecionado={cidSelecionado}
                                            placeholder="Digite o código ou descrição do CID..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="diagnostico"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Detalhamento do Diagnóstico</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detalhes adicionais sobre o diagnóstico..." {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="prescricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prescrição</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Medicamentos, dosagens, etc." {...field} rows={3}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="solicitacaoExames"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Solicitação de Exames</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Ex: Hemograma completo, Raio-X do tórax, etc." {...field} rows={3}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Atendimento'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
