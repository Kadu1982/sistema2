import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const IAAssistant = () => {
  const [mensagem, setMensagem] = useState("");
  const [conversa, setConversa] = useState<
    Array<{ tipo: "usuario" | "ia"; texto: string }>
  >([
    {
      tipo: "ia",
      texto:
        "Olá! Sou o assistente de IA do Sistema de Gerenciamento de Saúde. Como posso ajudar você hoje?",
    },
  ]);
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = () => {
    if (mensagem.trim() === "") return;

    // Adicionar mensagem do usuário
    setConversa([...conversa, { tipo: "usuario", texto: mensagem }]);

    // Simular processamento da IA
    setCarregando(true);

    // Preparar respostas de exemplo baseadas em palavras-chave
    const respostaSimulada = simularResposta(mensagem.toLowerCase());

    setTimeout(() => {
      setConversa((prev) => [...prev, { tipo: "ia", texto: respostaSimulada }]);
      setCarregando(false);
      setMensagem("");
    }, 1500);
  };

  // Função simples para simular as respostas da IA
  const simularResposta = (texto: string) => {
    if (
      texto.includes("agendamento") ||
      texto.includes("agendar") ||
      texto.includes("consulta")
    ) {
      return "Para agendar uma nova consulta, acesse o módulo de Agendamento no menu principal. Lá você poderá verificar horários disponíveis e profissionais.";
    }

    if (
      texto.includes("paciente") ||
      texto.includes("cadastro") ||
      texto.includes("cadastrar")
    ) {
      return "O cadastro de pacientes pode ser realizado através do módulo Cadastro do Munícipe. Certifique-se de incluir o número do cartão SUS para facilitar a integração com os demais módulos.";
    }

    if (
      texto.includes("faturamento") ||
      texto.includes("sisus") ||
      texto.includes("sus")
    ) {
      return "O faturamento dos procedimentos realizados é processado automaticamente pelo sistema, seguindo as regras do Ministério da Saúde. Você pode enviar os dados através do módulo de Faturamento > Envio SISUS.";
    }

    if (
      texto.includes("relatório") ||
      texto.includes("relatorio") ||
      texto.includes("estatística")
    ) {
      return "Você pode gerar diversos relatórios através do módulo de Faturamento > Relatórios. Também é possível visualizar estatísticas gerais no Dashboard.";
    }

    if (
      texto.includes("prontuário") ||
      texto.includes("prontuario") ||
      texto.includes("histórico")
    ) {
      return "O prontuário eletrônico do paciente está disponível nos módulos de atendimentover. Basta pesquisar pelo nome ou número do cartão SUS do paciente para acessar todo o histórico clínico.";
    }

    return "Entendi sua dúvida. Para obter mais informações sobre esse assunto, visite a seção correspondente no sistema ou consulte o manual do usuário. Se precisar de ajuda específica com procedimentos ou processos, por favor forneça mais detalhes.";
  };

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {conversa.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 rounded-lg p-3",
                msg.tipo === "usuario"
                  ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                  : "mr-auto max-w-[80%] bg-muted",
              )}
            >
              <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                {msg.tipo === "usuario" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className="text-sm">{msg.texto}</div>
            </div>
          ))}
          {carregando && (
            <div className="flex items-start gap-2 rounded-lg p-3 mr-auto max-w-[80%] bg-muted">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="text-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  .
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua pergunta..."
            className="min-h-[60px] flex-1 resize-none"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
              }
            }}
          />
          <Button
            className="h-[60px] px-3"
            onClick={enviarMensagem}
            disabled={mensagem.trim() === "" || carregando}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Este assistente de IA está conectado aos módulos do sistema e pode
          ajudar com dúvidas sobre procedimentos, fluxos de trabalho e
          funcionalidades.
        </p>
      </div>
    </div>
  );
};
