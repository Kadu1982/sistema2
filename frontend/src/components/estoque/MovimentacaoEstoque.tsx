import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Search,
  Calendar,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Movimentacao {
  id: string;
  tipo: "entrada" | "saida";
  item: string;
  categoria: "medicamento" | "insumo";
  quantidade: number;
  responsavel: string;
  data: string;
  motivo: string;
}

const movimentacoesRecentes: Movimentacao[] = [
  {
    id: "1",
    tipo: "entrada",
    item: "Paracetamol 500mg",
    categoria: "medicamento",
    quantidade: 100,
    responsavel: "João Silva",
    data: "2024-05-25",
    motivo: "Reposição de estoque",
  },
  {
    id: "2",
    tipo: "saida",
    item: "Seringas 5ml",
    categoria: "insumo",
    quantidade: 50,
    responsavel: "Maria Santos",
    data: "2024-05-25",
    motivo: "Dispensação para atendimentos",
  },
  {
    id: "3",
    tipo: "saida",
    item: "Omeprazol 20mg",
    categoria: "medicamento",
    quantidade: 30,
    responsavel: "Ana Costa",
    data: "2024-05-24",
    motivo: "Receita médica",
  },
];

export const MovimentacaoEstoque = () => {
  const { toast } = useToast();
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    tipo: "entrada" as "entrada" | "saida",
    item: "",
    categoria: "medicamento" as "medicamento" | "insumo",
    quantidade: "",
    motivo: "",
  });
  const [movimentacoes, setMovimentacoes] = useState(movimentacoesRecentes);
  const [filtro, setFiltro] = useState("");

  const handleRegistrarMovimentacao = () => {
    if (
      !novaMovimentacao.item ||
      !novaMovimentacao.quantidade ||
      !novaMovimentacao.motivo
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const movimentacao: Movimentacao = {
      id: Date.now().toString(),
      tipo: novaMovimentacao.tipo,
      item: novaMovimentacao.item,
      categoria: novaMovimentacao.categoria,
      quantidade: parseInt(novaMovimentacao.quantidade),
      responsavel: "Usuário Atual", // Pegar do contexto
      data: new Date().toISOString().split("T")[0],
      motivo: novaMovimentacao.motivo,
    };

    setMovimentacoes([movimentacao, ...movimentacoes]);

    toast({
      title: "Movimentação Registrada",
      description: `${novaMovimentacao.tipo === "entrada" ? "Entrada" : "Saída"} de ${novaMovimentacao.quantidade} ${novaMovimentacao.item} registrada com sucesso.`,
    });

    // Reset form
    setNovaMovimentacao({
      tipo: "entrada",
      item: "",
      categoria: "medicamento",
      quantidade: "",
      motivo: "",
    });
  };

  const movimentacoesFiltradas = movimentacoes.filter(
    (mov) =>
      mov.item.toLowerCase().includes(filtro.toLowerCase()) ||
      mov.motivo.toLowerCase().includes(filtro.toLowerCase()) ||
      mov.responsavel.toLowerCase().includes(filtro.toLowerCase()),
  );

  const getTipoIcon = (tipo: string) => {
    return tipo === "entrada" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === "entrada" ? (
      <Badge className="bg-green-500">Entrada</Badge>
    ) : (
      <Badge className="bg-red-500">Saída</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Movimentação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Movimentação</Label>
                <Select
                  value={novaMovimentacao.tipo}
                  onValueChange={(value: any) =>
                    setNovaMovimentacao({ ...novaMovimentacao, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Entrada
                      </div>
                    </SelectItem>
                    <SelectItem value="saida">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4" />
                        Saída
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={novaMovimentacao.categoria}
                  onValueChange={(value: any) =>
                    setNovaMovimentacao({
                      ...novaMovimentacao,
                      categoria: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicamento">Medicamento</SelectItem>
                    <SelectItem value="insumo">Insumo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="item">Item</Label>
              <Input
                id="item"
                placeholder="Nome do item..."
                value={novaMovimentacao.item}
                onChange={(e) =>
                  setNovaMovimentacao({
                    ...novaMovimentacao,
                    item: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="0"
                value={novaMovimentacao.quantidade}
                onChange={(e) =>
                  setNovaMovimentacao({
                    ...novaMovimentacao,
                    quantidade: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da movimentação..."
                value={novaMovimentacao.motivo}
                onChange={(e) =>
                  setNovaMovimentacao({
                    ...novaMovimentacao,
                    motivo: e.target.value,
                  })
                }
              />
            </div>

            <Button onClick={handleRegistrarMovimentacao} className="w-full">
              Registrar Movimentação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar movimentação..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {movimentacoesFiltradas.map((mov) => (
                <Card key={mov.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {getTipoIcon(mov.tipo)}
                      <div>
                        <h4 className="font-medium text-sm">{mov.item}</h4>
                        <p className="text-xs text-gray-600">{mov.motivo}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(mov.data).toLocaleDateString()}</span>
                          <User className="h-3 w-3" />
                          <span>{mov.responsavel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getTipoBadge(mov.tipo)}
                      <p className="text-sm font-semibold mt-1">
                        {mov.tipo === "entrada" ? "+" : "-"}
                        {mov.quantidade}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
