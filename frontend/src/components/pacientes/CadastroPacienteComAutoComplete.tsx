import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, User, Phone, FileText } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Hooks e Utils
import { usePacienteBusca } from '@/hooks/usePacienteBusca';
import { Paciente } from '@/types/Paciente';
import {
    obterNomeExibicao,
    formatarNomeComIndicador,
    formatarCpf,
    formatarTelefone,
    aplicarMascaraCpf,
    removerMascaraCpf
} from '@/lib/pacienteUtils';

// ✅ CORREÇÃO 1: Função helper para validar o formato do CPF. Será usada pelo Zod.
const validarCpfFormatoDigitos = (cpf: string): boolean => {
    if (!cpf) return false;
    const cpfLimpo = removerMascaraCpf(cpf);
    if (cpfLimpo.length !== 11 || /^(.)\1+$/.test(cpfLimpo)) return false;

    try {
        let soma = 0;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
        let resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

        return true;
    } catch {
        return false;
    }
};

// ✅ CORREÇÃO 1: Schema centralizado com TODAS as validações usando superRefine.
// Toda a sua lógica de validação manual e de useEffects foi movida para cá.
const cadastroPacienteSchema = z.object({
    nomeCompleto: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres.'),
    nomeSocial: z.string().optional(),
    cpf: z.string().optional(),
    justificativaAusenciaCpf: z.string().optional(),
    cns: z.string().optional(),
    sexo: z.string().optional(),
    dataNascimento: z.string().optional(),
    // ... (outros campos)
    acamado: z.boolean().optional(),
    domiciliado: z.boolean().optional(),
    condSaudeMental: z.boolean().optional(),
    usaPlantas: z.boolean().optional(),
    outrasCondicoes: z.string().optional(),
    municipio: z.string().optional(),
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    complemento: z.string().optional(),
    telefoneCelular: z.string().optional(),
    telefoneContato: z.string().optional(),
    tipoSanguineo: z.string().optional(),
    rg: z.string().optional(),
    orgaoEmissor: z.string().optional(),
    certidaoNascimento: z.string().optional(),
    carteiraTrabalho: z.string().optional(),
    tituloEleitor: z.string().optional(),
    prontuarioFamiliar: z.string().optional(),
    corRaca: z.string().optional(),
    etnia: z.string().optional(),
    escolaridade: z.string().optional(),
    situacaoFamiliar: z.string().optional(),
}).superRefine((data, ctx) => {
    // Regra 1: Nome social obrigatório para sexo 'OUTRO'
    if (data.sexo === 'OUTRO' && (!data.nomeSocial || data.nomeSocial.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Nome Social é obrigatório quando o sexo for 'Outro'",
            path: ["nomeSocial"],
        });
    }

    // Regra 2: Validação de CPF baseada na idade
    if (data.dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(data.dataNascimento);
        const diffMonths = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth());
        const cpfObrigatorio = diffMonths >= 6;

        if (cpfObrigatorio && !data.cpf) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF é obrigatório para pacientes com 6 meses ou mais.",
                path: ["cpf"],
            });
        }

        if (!cpfObrigatorio && !data.cpf && !data.justificativaAusenciaCpf) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Justificativa é obrigatória se o CPF não for informado para menores de 6 meses.",
                path: ["justificativaAusenciaCpf"],
            });
        }
    }

    // Regra 3: Validação do formato do CPF, se ele for preenchido
    if (data.cpf && !validarCpfFormatoDigitos(data.cpf)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "O CPF informado é inválido.",
            path: ["cpf"],
        });
    }
});

export type CadastroPacienteFormDataType = z.infer<typeof cadastroPacienteSchema>;

interface CadastroPacienteComAutoCompleteProps {
    onSubmit: (data: CadastroPacienteFormDataType) => void;
    isSubmitting?: boolean;
    submitButtonText?: string;
    initialData?: Partial<CadastroPacienteFormDataType>;
    onCancel?: () => void;
    isEditMode?: boolean;
}

const CadastroPacienteComAutoComplete: React.FC<CadastroPacienteComAutoCompleteProps> = ({
                                                                                             onSubmit,
                                                                                             isSubmitting = false,
                                                                                             submitButtonText = "Cadastrar",
                                                                                             initialData,
                                                                                             onCancel,
                                                                                             isEditMode = false,
                                                                                         }) => {
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
    const [alert, setAlert] = useState<{ type: 'warning', message: string } | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultadosRef = useRef<HTMLDivElement>(null);

    // ✅ CORREÇÃO 3: Usar `defaultValues` para carregar dados iniciais de forma segura.
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CadastroPacienteFormDataType>({
        resolver: zodResolver(cadastroPacienteSchema),
        defaultValues: initialData || {}
    });

    // ✅ CORREÇÃO 2: Usar o valor do formulário como única fonte da verdade para a busca.
    const nomeCompletoValue = watch('nomeCompleto') || '';
    const sexoValue = watch('sexo') || '';

    const { pacientes, isLoading: loadingNome } = usePacienteBusca(nomeCompletoValue);

    // ✅ CORREÇÃO 3: Usar `reset` para preencher o formulário quando `initialData` mudar.
    useEffect(() => {
        if (initialData) {
            const maskedData = {
                ...initialData,
                cpf: initialData.cpf ? aplicarMascaraCpf(initialData.cpf) : ''
            };
            reset(maskedData);
        }
    }, [initialData, reset]);

    // Lógica para fechar resultados quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultadosRef.current && !resultadosRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)
            ) {
                setMostrarResultados(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePacienteClick = (paciente: Paciente) => {
        const dadosFormatados = {
            ...paciente,
            cpf: paciente.cpf ? aplicarMascaraCpf(paciente.cpf) : '',
            dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento).toISOString().split('T')[0] : ''
        };
        reset(dadosFormatados);

        setPacienteSelecionado(paciente);
        setMostrarResultados(false);
        setAlert({
            type: 'warning',
            message: `Paciente encontrado: ${obterNomeExibicao(paciente)}. Os dados foram preenchidos. Verifique antes de salvar.`
        });
    };

    const handleFormSubmit = (data: CadastroPacienteFormDataType) => {
        const dataLimpa = {
            ...data,
            cpf: data.cpf ? removerMascaraCpf(data.cpf) : undefined
        };
        onSubmit(dataLimpa);
    };

    const limparFormulario = () => {
        reset({});
        setPacienteSelecionado(null);
        setMostrarResultados(false);
        setAlert(null);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{isEditMode ? 'Editar Paciente' : 'Cadastro de Paciente'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Seção de Busca */}
                    {!isEditMode && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold">🔍 Buscar Paciente Existente</h3>
                            <div className="space-y-2">
                                <Label htmlFor="nomeCompleto">Buscar por Nome</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        {...register('nomeCompleto')}
                                        ref={inputRef}
                                        placeholder="Digite o nome do paciente..."
                                        onFocus={() => nomeCompletoValue.length >= 2 && setMostrarResultados(true)}
                                        className="pl-10"
                                        autoComplete="off"
                                    />
                                    {loadingNome && <div className="absolute right-3 top-3 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
                                </div>
                                {errors.nomeCompleto && <p className="text-sm text-red-500">{errors.nomeCompleto.message}</p>}

                                {mostrarResultados && nomeCompletoValue.length >= 2 && (
                                    <div ref={resultadosRef} className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {!loadingNome && pacientes.length > 0 ? (
                                            pacientes.map((paciente) => (
                                                <Button key={paciente.id} variant="ghost" className="w-full justify-start p-3 h-auto" onClick={() => handlePacienteClick(paciente)} type="button">
                                                    <div className="flex flex-col items-start w-full">
                                                        <span className="font-medium text-left">{formatarNomeComIndicador(paciente)}</span>
                                                        <span className="text-xs text-gray-600">CPF: {formatarCpf(paciente.cpf)}</span>
                                                    </div>
                                                </Button>
                                            ))
                                        ) : !loadingNome && <div className="p-3 text-center text-gray-500">Nenhum paciente encontrado.</div>}
                                    </div>
                                )}
                            </div>
                            <Button type="button" onClick={limparFormulario} variant="outline">🧹 Limpar Busca e Formulário</Button>
                        </div>
                    )}

                    {!isEditMode && <Separator />}

                    {/* Alerta de Paciente Encontrado */}
                    {alert && (
                        <Alert variant="default" className="border-yellow-500 bg-yellow-50">
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    )}

                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">📋 Dados Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                                <Input {...register('nomeCompleto')} className={errors.nomeCompleto ? 'border-red-500' : ''} />
                                {errors.nomeCompleto && <p className="text-sm text-red-500">{errors.nomeCompleto.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                                <Input {...register('dataNascimento')} type="date" className={errors.dataNascimento ? 'border-red-500' : ''} />
                                {errors.dataNascimento && <p className="text-sm text-red-500">{errors.dataNascimento.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sexo">Sexo</Label>
                                <Select onValueChange={(value) => setValue('sexo', value)} value={sexoValue}>
                                    <SelectTrigger className={errors.sexo ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Selecione o sexo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                                        <SelectItem value="FEMININO">Feminino</SelectItem>
                                        <SelectItem value="OUTRO">Outro</SelectItem>
                                        <SelectItem value="NAO_INFORMADO">Não informado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sexo && <p className="text-sm text-red-500">{errors.sexo.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nomeSocial">Nome Social</Label>
                                <Input {...register('nomeSocial')} className={errors.nomeSocial ? 'border-red-500' : ''} />
                                {errors.nomeSocial && <p className="text-sm text-red-500">{errors.nomeSocial.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    {...register('cpf')}
                                    onChange={(e) => setValue('cpf', aplicarMascaraCpf(e.target.value))}
                                    placeholder="000.000.000-00"
                                    className={errors.cpf ? 'border-red-500' : ''}
                                />
                                {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="justificativaAusenciaCpf">Justificativa Ausência CPF</Label>
                                <Input {...register('justificativaAusenciaCpf')} className={errors.justificativaAusenciaCpf ? 'border-red-500' : ''} />
                                {errors.justificativaAusenciaCpf && <p className="text-sm text-red-500">{errors.justificativaAusenciaCpf.message}</p>}
                            </div>
                        </div>
                        {/* ... (Restante do formulário) ... */}
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-4 pt-6">
                        {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>❌ Cancelar</Button>}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : `✅ ${submitButtonText}`}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CadastroPacienteComAutoComplete;