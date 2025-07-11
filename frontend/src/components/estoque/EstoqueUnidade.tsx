import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Building2, Search, Package, Eye } from "lucide-react";

const unidadesSaude = [
  { id: "1", nome: "UBS Centro", medicamentos: 45, insumos: 23, alertas: 3 },
  {
    id: "2",
    nome: "UBS Jardim das Flores",
    medicamentos: 38,
    insumos: 19,
    alertas: 1,
  },
  { id: "3", nome: "UBS Vila Nova", medicamentos: 42, insumos: 25, alertas: 5 },
  { id: "4", nome: "UBS São José", medicamentos: 40, insumos: 22, alertas: 2 },
];

export const EstoqueUnidade = () => {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [busca, setBusca] = useState("");

  const unidadesFiltradas = unidadesSaude.filter((unidade) =>
    unidade.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const getAlertBadge = (alertas: number) => {
    if (alertas === 0) {
      return <Badge className="bg-green-500">Normal</Badge>;
    }
    if (alertas <= 2) {
      return <Badge className="bg-yellow-500">Atenção</Badge>;
    }
    return <Badge variant="destructive">Crítico</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Estoque por Unidade de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar unidade de saúde..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div className="w-64">
              <Select
                value={unidadeSelecionada}
                onValueChange={setUnidadeSelecionada}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as unidades</SelectItem>
                  {unidadesSaude.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unidadesFiltradas.map((unidade) => (
              <Card
                key={unidade.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{unidade.nome}</h3>
                    {getAlertBadge(unidade.alertas)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medicamentos:</span>
                      <span className="font-medium">
                        {unidade.medicamentos} itens
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insumos:</span>
                      <span className="font-medium">
                        {unidade.insumos} itens
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alertas:</span>
                      <span
                        className={`font-medium ${unidade.alertas > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {unidade.alertas}
                      </span>
                    </div>
                  </div>

                  {unidade.alertas > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{unidade.alertas} item(s) com estoque baixo</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
