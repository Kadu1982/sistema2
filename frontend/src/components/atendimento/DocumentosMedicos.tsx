// src/components/atendimentover/DocumentosMedicos.tsx

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Pill, Send, PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { criarPrescricao } from "@/services/farmaciaService"; // ANOTAÇÃO: Importa o serviço da farmácia.

const atestadoSchema = z.object({
  motivo: z.string().min(10, "O motivo deve ter no mínimo 10 caracteres."),
  diasAfastamento: z.coerce.number().min(1, "O número de dias deve ser pelo menos 1."),
});
type AtestadoFormData = z.infer<typeof atestadoSchema>;

const receitaSchema = z.object({
  medicamentos: z.array(
      z.object({
        nome: z.string().min(3, "O nome do medicamento é obrigatório."),
        dosagem: z.string().min(1, "A dosagem é obrigatória."),
        instrucoes: z.string().min(5, "As instruções são obrigatórias."),
      })
  ).min(1, "É necessário prescrever ao menos um medicamento."),
});
type ReceitaFormData = z.infer<typeof receitaSchema>;

const encaminhamentoSchema = z.object({
  especialidade: z.string().min(1, "A especialidade é obrigatória."),
  motivo: z.string().min(10, "O motivo do encaminhamento é obrigatório."),
});
type EncaminhamentoFormData = z.infer<typeof encaminhamentoSchema>;

interface DocumentosMedicosProps {
  pacienteId: string;
  atendimentoId: string;
}

export function DocumentosMedicos({ pacienteId, atendimentoId }: DocumentosMedicosProps) {
  const { toast } = useToast();

  const formAtestado = useForm<AtestadoFormData>({
    resolver: zodResolver(atestadoSchema),
    defaultValues: { motivo: "", diasAfastamento: 1 },
  });

  const formReceita = useForm<ReceitaFormData>({
    resolver: zodResolver(receitaSchema),
    defaultValues: { medicamentos: [{ nome: "", dosagem: "", instrucoes: "" }] },
  });
  const { fields, append, remove } = useFieldArray({
    control: formReceita.control,
    name: "medicamentos",
  });

  const formEncaminhamento = useForm<EncaminhamentoFormData>({
    resolver: zodResolver(encaminhamentoSchema),
    defaultValues: { especialidade: "", motivo: "" },
  });

  const onGerarAtestado = (data: AtestadoFormData) => {
    console.log("Gerando Atestado:", { ...data, pacienteId, atendimentoId });
    toast({ title: "Atestado Gerado", description: "O atestado foi salvo no prontuário." });
    formAtestado.reset();
  };

  // ANOTAÇÃO: Função atualizada para enviar a receita para o serviço da farmácia.
  const onGerarReceita = async (data: ReceitaFormData) => {
    try {
      await criarPrescricao({
        pacienteId,
        atendimentoId,
        medicamentos: data.medicamentos,
      });
      toast({ title: "Receita Enviada para a Farmácia", description: "A prescrição está disponível para dispensação." });
      formReceita.reset({ medicamentos: [{ nome: "", dosagem: "", instrucoes: "" }] });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Enviar Receita", description: "Não foi possível enviar a prescrição. Tente novamente." });
    }
  };

  const onGerarEncaminhamento = (data: EncaminhamentoFormData) => {
    console.log("Gerando Encaminhamento:", { ...data, pacienteId, atendimentoId });
    toast({ title: "Encaminhamento Gerado", description: "O encaminhamento foi salvo." });
    formEncaminhamento.reset();
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Emissão de Documentos</CardTitle>
          <CardDescription>Gere atestados, receitas e encaminhamentos para o paciente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="receita">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="atestado"><FileText className="mr-2 h-4 w-4" />Atestado</TabsTrigger>
              <TabsTrigger value="receita"><Pill className="mr-2 h-4 w-4" />Receita</TabsTrigger>
              <TabsTrigger value="encaminhamento"><Send className="mr-2 h-4 w-4" />Encaminhamento</TabsTrigger>
            </TabsList>

            <TabsContent value="atestado">
              <Form {...formAtestado}>
                <form onSubmit={formAtestado.handleSubmit(onGerarAtestado)} className="space-y-6 pt-4">
                  <FormField control={formAtestado.control} name="motivo" render={({ field }) => (
                      <FormItem><FormLabel>Motivo</FormLabel><FormControl><Textarea placeholder="Descreva o motivo..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <FormField control={formAtestado.control} name="diasAfastamento" render={({ field }) => (
                      <FormItem><FormLabel>Dias de Afastamento</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <Button type="submit" disabled={formAtestado.formState.isSubmitting}>Gerar Atestado</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="receita">
              <Form {...formReceita}>
                <form onSubmit={formReceita.handleSubmit(onGerarReceita)} className="space-y-6 pt-4">
                  {fields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border p-4 space-y-4 relative">
                        <FormLabel className="font-bold">Medicamento {index + 1}</FormLabel>
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <FormField control={formReceita.control} name={`medicamentos.${index}.nome`} render={({ field }) => (
                            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Ex: Amoxicilina" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                        />
                        <FormField control={formReceita.control} name={`medicamentos.${index}.dosagem`} render={({ field }) => (
                            <FormItem><FormLabel>Dosagem</FormLabel><FormControl><Input placeholder="Ex: 500mg" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                        />
                        <FormField control={formReceita.control} name={`medicamentos.${index}.instrucoes`} render={({ field }) => (
                            <FormItem><FormLabel>Instruções</FormLabel><FormControl><Textarea placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias." {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                        />
                      </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ nome: "", dosagem: "", instrucoes: "" })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                    </Button>
                    <Button type="submit" disabled={formReceita.formState.isSubmitting}>
                      {formReceita.formState.isSubmitting ? "Enviando..." : "Enviar para Farmácia"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="encaminhamento">
              <Form {...formEncaminhamento}>
                <form onSubmit={formEncaminhamento.handleSubmit(onGerarEncaminhamento)} className="space-y-6 pt-4">
                  <FormField control={formEncaminhamento.control} name="especialidade" render={({ field }) => (
                      <FormItem><FormLabel>Especialidade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="Dermatologia">Dermatologia</SelectItem>
                        <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                      </SelectContent></Select><FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField control={formEncaminhamento.control} name="motivo" render={({ field }) => (
                      <FormItem><FormLabel>Motivo</FormLabel><FormControl><Textarea placeholder="Descreva o motivo..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <Button type="submit" disabled={formEncaminhamento.formState.isSubmitting}>Gerar Encaminhamento</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  );
}