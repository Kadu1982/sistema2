package com.sistemadesaude.backend.recepcao.repository;

import com.sistemadesaude.backend.recepcao.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a WHERE a.pacienteId = :pacienteId AND a.status = 'AGENDADO' AND a.dataHora BETWEEN :inicio AND :fim ORDER BY a.dataHora ASC")
    Optional<Agendamento> findAgendamentoAtivoPorPaciente(Long pacienteId, LocalDateTime inicio, LocalDateTime fim);

    // ✅ EXISTENTE: Busca todos os agendamentos dentro de um intervalo de datas.
    List<Agendamento> findByDataHoraBetweenOrderByDataHoraAsc(LocalDateTime inicio, LocalDateTime fim);

    // ✅ Novo nome correto: busca por paciente
    List<Agendamento> findByPacienteIdOrderByDataHoraDesc(Long pacienteId);

    List<Agendamento> findByDataHoraBetweenOrderByDataHora(LocalDateTime inicio, LocalDateTime fim);

    List<Agendamento> findByPacienteId(Long pacienteId);
}
