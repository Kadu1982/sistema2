import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriagemPaciente } from "@/components/triagem/TriagemPaciente";

const Triagem = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        Triagem e Classificação de Risco
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Triagem</CardTitle>
          <CardDescription>
            Classificação de risco e priorização de atendimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TriagemPaciente />
        </CardContent>
      </Card>
    </div>
  );
};

export default Triagem;
