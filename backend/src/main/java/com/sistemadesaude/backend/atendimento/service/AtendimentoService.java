package com.sistemadesaude.backend.atendimento.service;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interface de serviço para operações relacionadas ao Atendimento.
 */
public interface AtendimentoService {

    /**
     * Cria um novo atendimento
     */
    AtendimentoDTO criarAtendimento(AtendimentoDTO dto);

    /**
     * Busca atendimento por ID
     */
    AtendimentoDTO buscarPorId(String id);

    /**
     * Lista todos os atendimentos
     */
    List<AtendimentoDTO> listarTodos();

    /**
     * Busca atendimentos por paciente
     */
    List<AtendimentoDTO> buscarPorPaciente(String pacienteId);

    /**
     * Busca atendimentos por CID10
     */
    List<AtendimentoDTO> buscarPorCid10(String cid10);

    /**
     * Busca atendimentos em um período
     */
    List<AtendimentoDTO> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim);

    /**
     * Busca atendimentos por diagnóstico
     */
    List<AtendimentoDTO> buscarPorDiagnostico(String diagnostico);

    /**
     * Atualiza um atendimento
     */
    AtendimentoDTO atualizarAtendimento(String id, AtendimentoDTO dto);

    /**
     * Exclui um atendimento
     */
    void excluirAtendimento(String id);
}