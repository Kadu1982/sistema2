// src/pages/AtendimentoOdontologico.tsx

import { AtendimentoForm, AtendimentoFormData } from "@/components/atendimento/AtendimentoForm";
import OdontogramaDigital from "@/components/odontologico/OdontogramaDigital";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const AtendimentoOdontologico = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // ANOTAÇÃO: Função de callback para salvar os dados do atendimentover odontológico.
  const handleSaveAtendimento = (data: AtendimentoFormData) => {
    setIsLoading(true);
    console.log("Dados do Atendimento Odontológico:", data);

    // Simula uma chamada de API
    setTimeout(() => {
      toast({
        title: "Sucesso!",
        description: "Atendimento odontológico salvo com sucesso.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/*
          ANOTAÇÃO: CORREÇÃO APLICADA.
          A página agora é composta pelo formulário genérico e pelo componente específico de odontograma,
          criando um layout de duas colunas em telas maiores.
        */}
          <AtendimentoForm
              title="Registro de Atendimento Odontológico"
              description="Preencha os dados da consulta e utilize o odontograma ao lado."
              onSave={handleSaveAtendimento}
              isLoading={isLoading}
          />
          <OdontogramaDigital />
        </div>
      </div>
  );
};

export default AtendimentoOdontologico;