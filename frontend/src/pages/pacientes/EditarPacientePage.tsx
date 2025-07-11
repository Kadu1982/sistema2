import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CadastroPacienteComAutoComplete, { CadastroPacienteFormDataType } from '@/components/pacientes/CadastroPacienteComAutoComplete';
import { getPacienteById, updatePaciente, PacienteInput } from '@/services/pacienteService';
import { toast } from '@/components/ui/use-toast';
import { Paciente } from '@/types/Paciente';

// FUNÇÃO PARA CONVERTER PACIENTE PARA DADOS DO FORMULÁRIO
const converterPacienteParaFormulario = (paciente: Paciente): Partial<CadastroPacienteFormDataType> => {
    return {
        nomeCompleto: paciente.nomeCompleto || '',
        nomeSocial: paciente.nomeSocial || '',
        cpf: paciente.cpf || '',
        justificativaAusenciaCpf: paciente.justificativaAusenciaCpf || '',
        cns: paciente.cns || '',
        sexo: paciente.sexo || '',
        dataNascimento: paciente.dataNascimento || '',
        acamado: paciente.acamado || false,
        domiciliado: paciente.domiciliado || false,
        condSaudeMental: paciente.condSaudeMental || false,
        usaPlantas: paciente.usaPlantas || false,
        outrasCondicoes: paciente.outrasCondicoes || '',
        municipio: paciente.municipio || '',
        cep: paciente.cep || '',
        logradouro: paciente.logradouro || '',
        numero: paciente.numero || '',
        bairro: paciente.bairro || '',
        complemento: paciente.complemento || '',
        telefoneCelular: paciente.telefoneCelular || '',
        telefoneContato: paciente.telefoneContato || '',
        tipoSanguineo: paciente.tipoSanguineo || '',
        rg: paciente.rg || '',
        orgaoEmissor: paciente.orgaoEmissor || '',
        certidaoNascimento: paciente.certidaoNascimento || '',
        carteiraTrabalho: paciente.carteiraTrabalho || '',
        tituloEleitor: paciente.tituloEleitor || '',
        prontuarioFamiliar: paciente.prontuarioFamiliar || '',
        corRaca: paciente.corRaca || '',
        etnia: paciente.etnia || '',
        escolaridade: paciente.escolaridade || '',
        situacaoFamiliar: paciente.situacaoFamiliar || '',
    };
};

const EditarPacientePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dadosIniciais, setDadosIniciais] = useState<Partial<CadastroPacienteFormDataType> | undefined>(undefined);
    const [pacienteOriginal, setPacienteOriginal] = useState<Paciente | null>(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            if (!id) {
                navigate('/pacientes');
                return;
            }

            try {
                const pacienteData = await getPacienteById(parseInt(id));
                console.log('📝 Dados do paciente carregados:', pacienteData);

                setPacienteOriginal(pacienteData);
                const dadosConvertidos = converterPacienteParaFormulario(pacienteData);
                console.log('📝 Dados convertidos para o formulário:', dadosConvertidos);

                setDadosIniciais(dadosConvertidos);
            } catch (error) {
                console.error('❌ Erro ao buscar paciente:', error);
                toast({
                    title: "Erro!",
                    description: "Erro ao carregar dados do paciente.",
                    variant: "destructive",
                });
                navigate('/pacientes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaciente();
    }, [id, navigate]);

    const handleSubmit = async (data: CadastroPacienteFormDataType) => {
        if (!id) return;

        console.log('📝 Dados recebidos do formulário:', data);

        // VALIDAÇÃO: Se sexo for "OUTRO", nome social é obrigatório
        if (data.sexo === 'OUTRO' && (!data.nomeSocial || data.nomeSocial.trim() === '')) {
            toast({
                title: "Erro de Validação!",
                description: "Quando o sexo é 'Outro', o Nome Social é obrigatório.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const pacienteData: PacienteInput = {
                nomeCompleto: data.nomeCompleto,
                nomeSocial: data.nomeSocial || null,
                cpf: data.cpf || null,
                justificativaAusenciaCpf: data.justificativaAusenciaCpf || null,
                cns: data.cns || null,
                sexo: data.sexo || null,
                dataNascimento: data.dataNascimento || null,
                acamado: data.acamado || false,
                domiciliado: data.domiciliado || false,
                condSaudeMental: data.condSaudeMental || false,
                usaPlantas: data.usaPlantas || false,
                outrasCondicoes: data.outrasCondicoes || null,
                municipio: data.municipio || null,
                cep: data.cep || null,
                logradouro: data.logradouro || null,
                numero: data.numero || null,
                bairro: data.bairro || null,
                complemento: data.complemento || null,
                telefoneCelular: data.telefoneCelular || null,
                telefoneContato: data.telefoneContato || null,
                tipoSanguineo: data.tipoSanguineo || null,
                rg: data.rg || null,
                orgaoEmissor: data.orgaoEmissor || null,
                certidaoNascimento: data.certidaoNascimento || null,
                carteiraTrabalho: data.carteiraTrabalho || null,
                tituloEleitor: data.tituloEleitor || null,
                prontuarioFamiliar: data.prontuarioFamiliar || null,
                corRaca: data.corRaca || null,
                etnia: data.etnia || null,
                escolaridade: data.escolaridade || null,
                situacaoFamiliar: data.situacaoFamiliar || null,
            };

            console.log('📤 Enviando dados para atualização:', pacienteData);

            await updatePaciente(parseInt(id), pacienteData);

            toast({
                title: "Sucesso!",
                description: "Paciente atualizado com sucesso.",
                className: "bg-green-100 text-green-800",
            });
            navigate('/pacientes');
        } catch (error: any) {
            console.error('❌ Erro ao atualizar paciente:', error);

            let mensagemErro = "Erro ao atualizar paciente. Tente novamente.";
            if (error.response?.data?.message) {
                mensagemErro = error.response.data.message;
            } else if (error.message) {
                mensagemErro = error.message;
            }

            toast({
                title: "Erro!",
                description: mensagemErro,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/pacientes');
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Carregando dados do paciente...</span>
                </div>
            </div>
        );
    }

    if (!dadosIniciais || !pacienteOriginal) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600">Paciente não encontrado.</p>
                    <Button onClick={() => navigate('/pacientes')} className="mt-4">
                        Voltar para Lista de Pacientes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate('/pacientes')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Lista de Pacientes
                </Button>
            </div>

            <div className="mb-4">
                <h1 className="text-2xl font-bold">Editar Paciente</h1>
                <p className="text-gray-600">
                    Editando: {pacienteOriginal.nomeCompleto}
                    {pacienteOriginal.sexo === 'OUTRO' && pacienteOriginal.nomeSocial &&
                        ` (${pacienteOriginal.nomeSocial})`}
                </p>
            </div>

            <CadastroPacienteComAutoComplete
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitButtonText="Atualizar Paciente"
                initialData={dadosIniciais}
                onCancel={handleCancel}
                isEditMode={true}
            />
        </div>
    );
};

export default EditarPacientePage;