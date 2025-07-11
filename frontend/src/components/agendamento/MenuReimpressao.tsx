
import React from 'react';
import {
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Printer, FileText, Ban } from 'lucide-react';
import { AgendamentoDTO, DadosReimpressao, TipoDocumentoReimpressao, podeGerarSadt, podeGerarComprovante } from '@/types/Agendamento';
import { useReimpressao } from '@/hooks/useReimpressao';

interface MenuReimpressaoProps {
    agendamento: AgendamentoDTO;
}

/**
 * Componente reutilizável para menu de opções de reimpressão
 */
const MenuReimpressao: React.FC<MenuReimpressaoProps> = ({ agendamento }) => {
    const { isReimprimindo, reimprimirSadt, reimprimirComprovante } = useReimpressao();

    // Converter AgendamentoDTO para DadosReimpressao
    const converterParaDadosReimpressao = (agendamento: AgendamentoDTO): DadosReimpressao => ({
        agendamentoId: agendamento.id,
        pacienteId: agendamento.pacienteId || agendamento.id, // Fallback se não tiver pacienteId
        pacienteNome: agendamento.pacienteNome,
        pacienteDataNascimento: agendamento.pacienteDataNascimento,
        tipo: agendamento.tipo,
        especialidade: agendamento.especialidade,
        examesSelecionados: agendamento.examesSelecionados,
        prioridade: agendamento.prioridade,
        observacoes: agendamento.observacoes,
        unidade: agendamento.unidade,
        dataHora: agendamento.dataHora
    });

    const handleReimpressao = async (tipoDocumento: TipoDocumentoReimpressao) => {
        if (isReimprimindo) return;

        try {
            const dadosReimpressao = converterParaDadosReimpressao(agendamento);

            if (tipoDocumento === 'sadt') {
                await reimprimirSadt(dadosReimpressao);
            } else {
                await reimprimirComprovante(dadosReimpressao);
            }
        } catch (error) {
            console.error('Erro no menu de reimpressão:', error);
        }
    };

    const podeReimprimirSadt = podeGerarSadt(agendamento.tipo);
    const podeReimprimirComprovante = podeGerarComprovante(agendamento.tipo);
    const temDocumentosDisponiveis = podeReimprimirSadt || podeReimprimirComprovante;

    return (
        <>
            <DropdownMenuSeparator />

            {/* Opção para SADT */}
            {podeReimprimirSadt && (
                <DropdownMenuItem
                    onClick={() => handleReimpressao('sadt')}
                    disabled={isReimprimindo}
                    className="cursor-pointer"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    {isReimprimindo ? 'Gerando...' : 'Reimprimir SADT'}
                </DropdownMenuItem>
            )}

            {/* Opção para Comprovante */}
            {podeReimprimirComprovante && (
                <DropdownMenuItem
                    onClick={() => handleReimpressao('comprovante')}
                    disabled={isReimprimindo}
                    className="cursor-pointer"
                >
                    <FileText className="mr-2 h-4 w-4" />
                    {isReimprimindo ? 'Gerando...' : 'Reimprimir Comprovante'}
                </DropdownMenuItem>
            )}

            {/* Mensagem quando não há documentos disponíveis */}
            {!temDocumentosDisponiveis && (
                <DropdownMenuItem disabled className="opacity-50">
                    <Ban className="mr-2 h-4 w-4" />
                    Nenhum documento disponível
                </DropdownMenuItem>
            )}
        </>
    );
};

export default MenuReimpressao;
