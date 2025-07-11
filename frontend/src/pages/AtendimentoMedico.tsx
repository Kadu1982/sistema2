// src/pages/AtendimentoMedico.tsx

import { AtendimentoForm, AtendimentoFormData } from "@/components/atendimento/AtendimentoForm";
import { HistoricoAtendimentos } from "@/components/atendimento/HistoricoAtendimentos";
import { DocumentosMedicos } from "@/components/atendimento/DocumentosMedicos";
import { AgendamentosTab } from "@/components/atendimento/AgendamentosTab";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AtendimentoMedico = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pacienteId, setPacienteId] = useState<string>("");
  const [atendimentoId, setAtendimentoId] = useState<string>("");

  // ANOTAÇÃO: Esta função será passada para o componente do formulário.
  // Ela recebe os dados do formulário quando ele é submetido com sucesso.
  const handleSaveAtendimento = (data: AtendimentoFormData) => {
    setIsLoading(true);
    console.log("Dados do Atendimento Médico:", data);

    // Atualiza o pacienteId para uso nos outros componentes
    setPacienteId(data.pacienteId);

    // Simula uma chamada de API
    setTimeout(() => {
      // Simula um ID de atendimentover gerado pelo backend
      const novoAtendimentoId = "atd-" + Date.now().toString();
      setAtendimentoId(novoAtendimentoId);

      toast({
        title: "Sucesso!",
        description: "Atendimento médico salvo com sucesso.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="agendamentos">
        <TabsList className="mb-4">
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="novo">Novo Atendimento</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="agendamentos">
          <AgendamentosTab />
        </TabsContent>

        <TabsContent value="novo">
          <AtendimentoForm
            title="Registro de Atendimento Médico"
            description="Preencha os dados do atendimento clínico abaixo."
            onSave={handleSaveAtendimento}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="documentos">
          {pacienteId && atendimentoId ? (
            <DocumentosMedicos 
              pacienteId={pacienteId} 
              atendimentoId={atendimentoId} 
            />
          ) : (
            <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
              Selecione um paciente e crie um atendimento primeiro para gerar documentos.
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico">
          {pacienteId ? (
            <HistoricoAtendimentos pacienteId={pacienteId} />
          ) : (
            <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
              Selecione um paciente primeiro para visualizar o histórico de atendimentos.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AtendimentoMedico;
