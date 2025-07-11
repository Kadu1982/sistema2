import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Thermometer,
  Heart,
  Activity,
  Weight,
  Ruler,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DadosTriagem {
  pressaoArterial: string;
  temperatura: string;
  peso: string;
  altura: string;
  frequenciaCardiaca: string;
  saturacaoOxigenio: string;
  queixaPrincipal: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  observacoes: string;
}

interface PacienteTriagem {
  id: string;
  nome: string;
  cartaoSus: string;
  idade: number;
  horarioRecepcao: string;
}

export const TriagemPaciente: React.FC = () => {
  const { toast } = useToast();
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<PacienteTriagem | null>(null);
  const [dadosTriagem, setDadosTriagem] = useState<DadosTriagem>({
    pressaoArterial: "",
    temperatura: "",
    peso: "",
    altura: "",
    frequenciaCardiaca: "",
    saturacaoOxigenio: "",
    queixaPrincipal: "",
    prioridade: "baixa",
    observacoes: "",
  });

  // Pacientes aguardando triagem (simulado)
  const pacientesAguardando: PacienteTriagem[] = [
    {
      id: "1",
      nome: "Maria Silva Santos",
      cartaoSus: "123456789012345",
      idade: 45,
      horarioRecepcao: "08:30",
    },
    {
      id: "2",
      nome: "João Pereira Costa",
      cartaoSus: "987654321098765",
      idade: 32,
      horarioRecepcao: "09:15",
    },
  ];

  const handleFinalizarTriagem = () => {
    if (!pacienteSelecionado) return;

    toast({
      title: "Triagem Concluída",
      description: `${pacienteSelecionado.nome} foi classificado como prioridade ${dadosTriagem.prioridade} e direcionado para atendimento médico.`,
    });

    // Reset form
    setPacienteSelecionado(null);
    setDadosTriagem({
      pressaoArterial: "",
      temperatura: "",
      peso: "",
      altura: "",
      frequenciaCardiaca: "",
      saturacaoOxigenio: "",
      queixaPrincipal: "",
      prioridade: "baixa",
      observacoes: "",
    });
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "urgente":
        return <Badge className="bg-red-500">Urgente</Badge>;
      case "alta":
        return <Badge className="bg-orange-500">Alta</Badge>;
      case "media":
        return <Badge className="bg-yellow-500">Média</Badge>;
      default:
        return <Badge className="bg-green-500">Baixa</Badge>;
    }
  };

  if (!pacienteSelecionado) {
    return (
      <div className="space-y-6">
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            Selecione um paciente da lista de aguardando triagem
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Pacientes Aguardando Triagem</CardTitle>
            <CardDescription>
              Pacientes recepcionados aguardando classificação de risco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pacientesAguardando.map((paciente) => (
                <Card
                  key={paciente.id}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setPacienteSelecionado(paciente)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{paciente.nome}</h4>
                        <p className="text-sm text-gray-600">
                          Cartão SUS: {paciente.cartaoSus} | Idade:{" "}
                          {paciente.idade} anos
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            Recepcionado às {paciente.horarioRecepcao}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Paciente em Triagem:</strong> {pacienteSelecionado.nome} -
          <strong> Cartão SUS:</strong> {pacienteSelecionado.cartaoSus}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sinais Vitais</CardTitle>
            <CardDescription>
              Aferição dos sinais vitais do paciente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pressao">Pressão Arterial</Label>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <Input
                    id="pressao"
                    placeholder="120/80"
                    value={dadosTriagem.pressaoArterial}
                    onChange={(e) =>
                      setDadosTriagem({
                        ...dadosTriagem,
                        pressaoArterial: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <Input
                    id="temperatura"
                    placeholder="36.5"
                    value={dadosTriagem.temperatura}
                    onChange={(e) =>
                      setDadosTriagem({
                        ...dadosTriagem,
                        temperatura: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-green-500" />
                  <Input
                    id="peso"
                    placeholder="70.5"
                    value={dadosTriagem.peso}
                    onChange={(e) =>
                      setDadosTriagem({ ...dadosTriagem, peso: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-500" />
                  <Input
                    id="altura"
                    placeholder="170"
                    value={dadosTriagem.altura}
                    onChange={(e) =>
                      setDadosTriagem({
                        ...dadosTriagem,
                        altura: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="frequencia">Freq. Cardíaca (bpm)</Label>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-400" />
                  <Input
                    id="frequencia"
                    placeholder="72"
                    value={dadosTriagem.frequenciaCardiaca}
                    onChange={(e) =>
                      setDadosTriagem({
                        ...dadosTriagem,
                        frequenciaCardiaca: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="saturacao">Saturação O2 (%)</Label>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <Input
                    id="saturacao"
                    placeholder="98"
                    value={dadosTriagem.saturacaoOxigenio}
                    onChange={(e) =>
                      setDadosTriagem({
                        ...dadosTriagem,
                        saturacaoOxigenio: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliação e Classificação</CardTitle>
            <CardDescription>
              Queixa principal e classificação de risco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="queixa">Queixa Principal</Label>
              <Textarea
                id="queixa"
                placeholder="Descreva a queixa principal do paciente..."
                value={dadosTriagem.queixaPrincipal}
                onChange={(e) =>
                  setDadosTriagem({
                    ...dadosTriagem,
                    queixaPrincipal: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="prioridade">Classificação de Prioridade</Label>
              <Select
                value={dadosTriagem.prioridade}
                onValueChange={(value: any) =>
                  setDadosTriagem({ ...dadosTriagem, prioridade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa - Verde</SelectItem>
                  <SelectItem value="media">Média - Amarelo</SelectItem>
                  <SelectItem value="alta">Alta - Laranja</SelectItem>
                  <SelectItem value="urgente">Urgente - Vermelho</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2">
                {getPrioridadeBadge(dadosTriagem.prioridade)}
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais..."
                value={dadosTriagem.observacoes}
                onChange={(e) =>
                  setDadosTriagem({
                    ...dadosTriagem,
                    observacoes: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setPacienteSelecionado(null)}>
          Voltar à Lista
        </Button>

        <Button onClick={handleFinalizarTriagem}>
          Finalizar Triagem e Encaminhar
        </Button>
      </div>
    </div>
  );
};
