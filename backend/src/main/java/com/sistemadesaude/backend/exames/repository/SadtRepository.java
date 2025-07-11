package com.sistemadesaude.backend.verdepois.repository;

import com.sistemadesaude.backend.documentos.Sadt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SadtRepository extends JpaRepository<Sadt, Long> {

    // Buscar por número SADT
    Optional<Sadt> findByNumeroSadt(String numeroSadt);

    // ✅ NOVO: Contar SADTs por prefixo do número
    long countByNumeroSadtStartingWith(String prefixo);

    // Buscar SADTs por paciente
    List<Sadt> findByPacienteIdOrderByDataEmissaoDesc(Long pacienteId);

    // Buscar SADTs por recepcao
    List<Sadt> findByAgendamentoId(Long agendamentoId);

    // Buscar SADTs por tipo
    List<Sadt> findByTipoSadtOrderByDataEmissaoDesc(Sadt.TipoSadt tipoSadt);

    // Buscar SADTs urgentes
    List<Sadt> findByUrgenteOrderByDataEmissaoDesc(Boolean urgente);

    // Buscar por período
    @Query("SELECT s FROM Sadt s WHERE s.dataEmissao BETWEEN :dataInicio AND :dataFim ORDER BY s.dataEmissao DESC")
    List<Sadt> findByPeriodo(@Param("dataInicio") LocalDateTime dataInicio,
                             @Param("dataFim") LocalDateTime dataFim);

    // Contar por tipo no dia - CORRIGIDO
    @Query("SELECT COUNT(s) FROM Sadt s WHERE s.tipoSadt = :tipo AND CAST(s.dataEmissao AS DATE) = CURRENT_DATE")
    Long countByTipoHoje(@Param("tipo") Sadt.TipoSadt tipo);

    // Buscar últimas SADTs
    @Query("SELECT s FROM Sadt s ORDER BY s.dataEmissao DESC")
    List<Sadt> findUltimasSadts(org.springframework.data.domain.Pageable pageable);

    // Gerar próximo número SADT
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(s.numeroSadt, 5) AS long)), 0) FROM Sadt s WHERE s.numeroSadt LIKE :prefixo")
    Long findUltimoNumero(@Param("prefixo") String prefixo);
}