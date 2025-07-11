package com.sistemadesaude.backend.operador.repository;

import com.sistemadesaude.backend.operador.entity.Operador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OperadorRepository extends JpaRepository<Operador, Long> {

    boolean existsByLogin(String login);

    /**
     * AULA 7: Expandindo as Capacidades de Busca.
     * Adicionamos mais dois métodos de consulta derivados.
     * Como a entidade Operador tem o campo 'cpf',
     * o Spring Data JPA automaticamente cria a consulta para buscar
     * um Operador por esse campo.
     * O retorno é um Optional<Operador>, pois pode não existir
     * um operador com o CPF fornecido.
     */
    Optional<Operador> findByCpf(String cpf);

    /**
     * ✅ REMOVIDO: O método findByTemplateId(String templateId) foi removido
     * pois o campo 'templateId' não existe na entidade Operador, o que causava
     * um erro de `PropertyReferenceException` na inicialização da aplicação.
     */

    /**
     * ✅ CORRIGIDO: Remove JOIN FETCH com relacionamentos que não existem mais
     * Mantém apenas o JOIN FETCH com perfis que ainda existe
     */
    @Query("SELECT o FROM Operador o " +
            "LEFT JOIN FETCH o.perfis " +
            "WHERE o.login = :login")
    Optional<Operador> findByLogin(@Param("login") String login);

    /**
     * ✅ CORRIGIDO E ADICIONADO: Método para buscar operadores por unidade (usando IDs)
     * A consulta foi corrigida para usar os campos corretos 'unidadeSaudeId' e 'unidadeAtualId'
     * ao invés do campo inexistente 'unidadeId'.
     */
    @Query("SELECT o FROM Operador o " +
            "LEFT JOIN FETCH o.perfis " +
            "WHERE o.unidadeSaudeId = :unidadeId " +
            "OR o.unidadeAtualId = :unidadeId")
    List<Operador> findByUnidadeId(@Param("unidadeId") Long unidadeId);

    /**
     * ✅ ADICIONADO: Método para buscar operadores ativos
     */
    @Query("SELECT o FROM Operador o " +
            "LEFT JOIN FETCH o.perfis " +
            "WHERE o.ativo = true")
    List<Operador> findByAtivoTrue();

    /**
     * ✅ ADICIONADO: Método para buscar operadores master
     */
    @Query("SELECT o FROM Operador o " +
            "LEFT JOIN FETCH o.perfis " +
            "WHERE o.isMaster = true")
    List<Operador> findByIsMasterTrue();
}