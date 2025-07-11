import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, Calendar, CreditCard, Users, AlertCircle, RefreshCw } from 'lucide-react';

import { usePacienteBusca } from '@/hooks/usePacienteBusca';
import { Paciente } from '@/types/Paciente';

interface PacienteBuscaProps {
    onSelecionarPaciente: (paciente: Paciente) => void;
    isLoading?: boolean;
}

export const PacienteBusca: React.FC<PacienteBuscaProps> = ({
                                                                onSelecionarPaciente,
                                                                isLoading = false
                                                            }) => {
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState<'nome' | 'cartaoSus' | 'cpf'>('nome');

    const {
        pacientes,
        isLoading: isBuscando,
        error,
        buscarPaciente,
        buscarAutomatico,
        limparBusca
    } = usePacienteBusca();

    // ✅ BUSCA MANUAL (quando clica no botão)
    const handleBuscarManual = useCallback(async () => {
        if (!termoBusca.trim()) {
            return;
        }
        await buscarPaciente(termoBusca.trim(), tipoBusca);
    }, [termoBusca, tipoBusca, buscarPaciente]);

    // ✅ BUSCA AUTOMÁTICA (conforme digita)
    const handleTermoChange = useCallback((valor: string) => {
        setTermoBusca(valor);

        // Busca automática
        if (valor.trim()) {
            buscarAutomatico(valor.trim(), tipoBusca);
        } else {
            limparBusca();
        }
    }, [tipoBusca, buscarAutomatico, limparBusca]);

    // ✅ MUDANÇA DE TIPO DE BUSCA
    const handleTipoChange = useCallback((novoTipo: 'nome' | 'cartaoSus' | 'cpf') => {
        setTipoBusca(novoTipo);

        // Se há termo, refazer busca com novo tipo
        if (termoBusca.trim()) {
            buscarAutomatico(termoBusca.trim(), novoTipo);
        }
    }, [termoBusca, buscarAutomatico]);

    // ✅ BUSCA AO PRESSIONAR ENTER
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBuscarManual();
        }
    }, [handleBuscarManual]);

    // ✅ FUNÇÃO PARA FORMATAR DATA
    const formatarDataNascimento = useCallback((data: string | null | undefined): string => {
        if (!data) return 'Não informado';

        try {
            return new Date(data).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    }, []);

    // ✅ FUNÇÃO PARA TENTAR NOVAMENTE EM CASO DE ERRO
    const handleTentarNovamente = useCallback(() => {
        if (termoBusca.trim()) {
            buscarPaciente(termoBusca.trim(), tipoBusca);
        }
    }, [termoBusca, tipoBusca, buscarPaciente]);

    // ✅ FUNÇÃO PARA OBTER PLACEHOLDER DINÂMICO
    const getPlaceholder = useCallback(() => {
        switch (tipoBusca) {
            case 'nome':
                return 'Digite o nome do paciente... (mín. 2 caracteres)';
            case 'cpf':
                return 'Digite o CPF... (mín. 3 caracteres)';
            case 'cartaoSus':
                return 'Digite o Cartão SUS... (mín. 3 caracteres)';
            default:
                return 'Digite para buscar...';
        }
    }, [tipoBusca]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Buscar Paciente
                    {isBuscando && (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Campo de Busca */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="termoBusca">
                            Busca Automática
                            {isBuscando && (
                                <span className="text-blue-600 text-xs ml-2">
                                    (Buscando...)
                                </span>
                            )}
                        </Label>
                        <Input
                            id="termoBusca"
                            type="text"
                            placeholder={getPlaceholder()}
                            value={termoBusca}
                            onChange={(e) => handleTermoChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            A busca acontece automaticamente conforme você digita
                        </p>
                    </div>

                    <div>
                        <Label>Tipo de Busca</Label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={tipoBusca}
                            onChange={(e) => handleTipoChange(e.target.value as 'nome' | 'cartaoSus' | 'cpf')}
                            disabled={isLoading}
                        >
                            <option value="nome">Nome</option>
                            <option value="cartaoSus">Cartão SUS</option>
                            <option value="cpf">CPF</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={handleBuscarManual}
                            disabled={!termoBusca.trim() || isLoading}
                            className="w-full"
                            variant="outline"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Buscar Agora
                        </Button>
                    </div>
                </div>

                {/* Exibir erro se houver */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleTentarNovamente}
                                className="ml-2"
                            >
                                Tentar novamente
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Indicador de carregamento */}
                {isBuscando && (
                    <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Buscando pacientes...</span>
                        </div>
                    </div>
                )}

                {/* Resultados da Busca */}
                {pacientes.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                                {pacientes.length === 1
                                    ? '1 paciente encontrado'
                                    : `${pacientes.length} pacientes encontrados`}
                            </span>
                        </div>

                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {pacientes.map((paciente) => (
                                <Card key={paciente.id} className="hover:bg-gray-50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium text-lg">{paciente.nome}</h3>
                                                    {paciente.prioridade && (
                                                        <Badge variant="secondary">
                                                            {paciente.prioridade}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>SUS: {paciente.cartaoSus}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        <span>CPF: {paciente.cpf}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            Nasc: {formatarDataNascimento(paciente.dataNascimento)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => onSelecionarPaciente(paciente)}
                                                size="sm"
                                                disabled={isLoading}
                                            >
                                                Selecionar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mensagem quando não há resultados */}
                {termoBusca && pacientes.length === 0 && !isBuscando && !error && (
                    <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum paciente encontrado</p>
                        <p className="text-sm">
                            {tipoBusca === 'nome'
                                ? 'Digite pelo menos 2 caracteres para buscar por nome'
                                : 'Digite pelo menos 3 caracteres para buscar por números'}
                        </p>
                    </div>
                )}

                {/* Mensagem de ajuda */}
                {!termoBusca && (
                    <div className="text-center py-6 text-gray-400">
                        <Search className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                            Digite para começar a busca automática
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PacienteBusca;