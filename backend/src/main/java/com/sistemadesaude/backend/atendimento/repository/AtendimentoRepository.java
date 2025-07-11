package com.sistemadesaude.backend.atendimento.repository;

import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositório para operações de dados da entidade Atendimento.
 */
@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, String> {

    /**
     * Busca atendimentos por paciente ID
     */
    List<Atendimento> findByPacienteIdOrderByDataHoraDesc(String pacienteId);

    /**
     * Busca atendimentos por CID10
     */
    List<Atendimento> findByCid10OrderByDataHoraDesc(String cid10);

    /**
     * Busca atendimentos em um período
     */
    @Query("SELECT a FROM Atendimento a WHERE a.dataHora BETWEEN :inicio AND :fim ORDER BY a.dataHora DESC")
    List<Atendimento> findByDataHoraBetween(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    /**
     * Busca atendimentos por diagnóstico (contém)
     */
    List<Atendimento> findByDiagnosticoContainingIgnoreCaseOrderByDataHoraDesc(String diagnostico);
}