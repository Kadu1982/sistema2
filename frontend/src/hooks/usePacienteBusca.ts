
import { useState, useCallback, useEffect, useRef } from 'react';
import { Paciente } from '@/types/Paciente';
import { pacienteService } from '@/services/pacienteService';

interface UsePacienteBuscaReturn {
    pacientes: Paciente[];
    isLoading: boolean;
    error: string | null;
    buscarPaciente: (termo: string, tipo: 'nome' | 'cartaoSus' | 'cpf') => Promise<void>;
    buscarAutomatico: (termo: string, tipo: 'nome' | 'cartaoSus' | 'cpf') => void;
    limparBusca: () => void;
}

export const usePacienteBusca = (): UsePacienteBuscaReturn => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ FUNÇÃO DE BUSCA PRINCIPAL
    const buscarPaciente = useCallback(async (termo: string, tipo: 'nome' | 'cartaoSus' | 'cpf') => {
        if (!termo.trim()) {
            setPacientes([]);
            setError(null);
            return;
        }

        // Para números (CPF e Cartão SUS), aguardar pelo menos 3 caracteres
        if ((tipo === 'cpf' || tipo === 'cartaoSus') && termo.length < 3) {
            setPacientes([]);
            setError(null);
            return;
        }

        // Para nomes, aguardar pelo menos 2 caracteres
        if (tipo === 'nome' && termo.length < 2) {
            setPacientes([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log(`🔍 Buscando paciente por ${tipo}:`, termo);

            let resultados: Paciente[] = [];

            switch (tipo) {
                case 'nome':
                    resultados = await pacienteService.buscarPorNome(termo);
                    break;
                case 'cartaoSus':
                    const pacienteCartao = await pacienteService.buscarPorCartaoSus(termo);
                    resultados = pacienteCartao ? [pacienteCartao] : [];
                    break;
                case 'cpf':
                    const pacienteCpf = await pacienteService.buscarPorCpf(termo);
                    resultados = pacienteCpf ? [pacienteCpf] : [];
                    break;
                default:
                    throw new Error('Tipo de busca não reconhecido');
            }

            console.log(`✅ Encontrados ${resultados.length} paciente(s)`);
            setPacientes(resultados);

        } catch (err: any) {
            console.error('❌ Erro na busca de pacientes:', err);

            // ✅ TRATAMENTO ESPECÍFICO PARA ERRO 403
            if (err.response?.status === 403) {
                setError('Acesso negado. Verifique suas permissões ou faça login novamente.');
            } else if (err.response?.status === 401) {
                setError('Sessão expirada. Faça login novamente.');
            } else {
                setError(err.message || 'Erro ao buscar pacientes');
            }

            setPacientes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ✅ FUNÇÃO DE BUSCA AUTOMÁTICA COM DEBOUNCE
    const buscarAutomatico = useCallback((termo: string, tipo: 'nome' | 'cartaoSus' | 'cpf') => {
        // Limpar timeout anterior
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Se o termo estiver vazio, limpar imediatamente
        if (!termo.trim()) {
            setPacientes([]);
            setError(null);
            return;
        }

        // Definir delay baseado no tipo de busca
        const delay = tipo === 'nome' ? 500 : 300; // Nome: 500ms, Números: 300ms

        // Configurar novo timeout
        debounceTimeoutRef.current = setTimeout(() => {
            buscarPaciente(termo, tipo);
        }, delay);
    }, [buscarPaciente]);

    // ✅ FUNÇÃO PARA LIMPAR BUSCA
    const limparBusca = useCallback(() => {
        // Limpar timeout se existir
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        setPacientes([]);
        setError(null);
    }, []);

    // ✅ CLEANUP no unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return {
        pacientes,
        isLoading,
        error,
        buscarPaciente,
        buscarAutomatico,
        limparBusca
    };
};