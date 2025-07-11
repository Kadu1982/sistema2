import React from "react";
import { useAtendimentos } from "@/hooks/useAtendimentos";
// ✅ REMOVIDO: import incorreto do AtendimentoService
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Download,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Props = {
  pacienteId: string;
};

export const HistoricoAtendimentos: React.FC<Props> = ({ pacienteId }) => {
  const {
    data: atendimentos,
    isLoading,
    isError,
    error
  } = useAtendimentos(pacienteId);

  // ✅ Função para formatar data segura (resolve o erro TS2769)
  const formatarDataHora = (dataHora: string | undefined): string => {
    if (!dataHora) {
      return 'Data não informada';
    }

    try {
      const data = new Date(dataHora);

      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }

      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // ✅ Função simplificada para download de PDF
  const downloadPdf = async (id: string) => {
    try {
      console.log('📥 Solicitação de download do PDF para atendimento:', id);

      // ✅ IMPLEMENTAÇÃO TEMPORÁRIA
      toast({
        title: "ℹ️ Funcionalidade em Desenvolvimento",
        description: "O download de PDF será implementado em breve.",
        variant: "default"
      });

      // TODO: Implementar download quando o serviço estiver disponível

    } catch (error: any) {
      console.error('❌ Erro ao baixar PDF:', error);

      toast({
        title: "❌ Erro no Download",
        description: "Funcionalidade não disponível no momento",
        variant: "destructive"
      });
    }
  };

  // ✅ Estados de carregamento e erro
  if (isLoading) {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Histórico de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Carregando histórico...</span>
              </div>
            </div>
          </CardContent>
        </Card>
    );
  }

  if (isError) {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Erro ao Carregar Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>
              {error?.message || "Erro ao carregar atendimentos. Tente novamente."}
            </span>
            </div>
          </CardContent>
        </Card>
    );
  }

  // ✅ Quando não há atendimentos
  if (!atendimentos || atendimentos.length === 0) {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Histórico de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Stethoscope className="w-12 h-12" />
                <p className="text-lg font-medium">Nenhum atendimento encontrado</p>
                <p className="text-sm">Este paciente ainda não possui histórico de atendimentos.</p>
              </div>
            </div>
          </CardContent>
        </Card>
    );
  }

  // ✅ Interface principal
  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Histórico de Atendimentos
            </div>
            <Badge variant="secondary">
              {atendimentos.length} atendimento{atendimentos.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atendimentos.map((atendimento) => (
                <Card key={atendimento.id} className="border-l-4 border-l-blue-500 shadow-sm">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Data e Hora */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Data/Hora</p>
                          <p className="font-medium">
                            {formatarDataHora(atendimento.dataHora)}
                          </p>
                        </div>
                      </div>

                      {/* CID-10 */}
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">CID-10</p>
                          <p className="font-medium">{atendimento.cid10 || 'Não informado'}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Realizado
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Diagnóstico */}
                    {atendimento.diagnostico && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-1">Diagnóstico</p>
                          <p className="text-sm bg-gray-50 p-3 rounded-lg border">
                            {atendimento.diagnostico}
                          </p>
                        </div>
                    )}

                    {/* Prescrição */}
                    {atendimento.prescricao && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-1">Prescrição</p>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {atendimento.prescricao}
                          </p>
                        </div>
                    )}

                    {/* Observações */}
                    {atendimento.observacoes && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-1">Observações</p>
                          <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            {atendimento.observacoes}
                          </p>
                        </div>
                    )}

                    {/* Ações */}
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button
                          onClick={() => downloadPdf(atendimento.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>
  );
};