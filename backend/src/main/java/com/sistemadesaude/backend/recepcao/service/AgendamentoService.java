package com.sistemadesaude.backend.recepcao.service;

import com.sistemadesaude.backend.recepcao.dto.AgendamentoDTO;
import com.sistemadesaude.backend.recepcao.dto.NovoAgendamentoRequest;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface de serviço para operações de Agendamento na Recepção.
 */
public interface AgendamentoService {

    /**
     * Cria um novo agendamento
     */
    AgendamentoDTO criarAgendamento(NovoAgendamentoRequest request);

    /**
     * Lista agendamentos por data
     */
    List<AgendamentoDTO> listarPorData(LocalDate data);

    /**
     * Busca agendamento por ID
     */
    AgendamentoDTO buscarPorId(Long id);

    /**
     * Lista agendamentos por paciente
     */
    List<AgendamentoDTO> listarPorPaciente(Long pacienteId);

    /**
     * Atualiza status do agendamento
     */
    AgendamentoDTO atualizarStatus(Long id, String novoStatus);

    /**
     * Verifica se agendamento precisa de SADT
     */
    boolean precisaSadt(Long agendamentoId);

    /**
     * Lista todos os agendamentos
     */
    List<AgendamentoDTO> listarTodos();
}