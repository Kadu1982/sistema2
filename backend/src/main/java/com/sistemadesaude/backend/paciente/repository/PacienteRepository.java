
package com.sistemadesaude.backend.paciente.repository;

import com.sistemadesaude.backend.paciente.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface de repositório para a entidade Paciente.
 * Esta interface herda todos os métodos CRUD básicos do JpaRepository.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Optional<Paciente> findByCpf(String cpf);

    Optional<Paciente> findByCns(String cns);

    List<Paciente> findByNomeCompletoContainingIgnoreCase(String nome);

    boolean existsByCpf(String cpf);

    boolean existsByCns(String cns);

    /**
     * Busca pacientes por múltiplos critérios usando query personalizada.
     */
    @Query("""
        SELECT p FROM Paciente p 
        WHERE LOWER(p.nomeCompleto) LIKE LOWER(CONCAT('%', :termo, '%'))
        OR p.cpf = :termo
        OR p.cns = :termo
        OR LOWER(p.nomeSocial) LIKE LOWER(CONCAT('%', :termo, '%'))
        OR LOWER(p.nomeMae) LIKE LOWER(CONCAT('%', :termo, '%'))
        ORDER BY p.nomeCompleto ASC
        """)
    List<Paciente> buscarPorMultiplosCriterios(@Param("termo") String termo);
}