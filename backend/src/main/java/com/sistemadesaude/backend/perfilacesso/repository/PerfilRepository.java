
package com.sistemadesaude.backend.perfilacesso.repository;

import com.sistemadesaude.backend.perfilacesso.entity.Perfil;
import com.sistemadesaude.backend.perfilacesso.entity.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<PerfilEntity, Long> {

    /**
     * Busca perfil por tipo (enum)
     */
    Optional<PerfilEntity> findByTipo(Perfil tipo);

    /**
     * Verifica se existe perfil com tipo específico
     */
    boolean existsByTipo(Perfil tipo);

    /**
     * Busca por nome customizado
     */
    Optional<PerfilEntity> findByNomeCustomizado(String nomeCustomizado);

    /**
     * Verifica se existe perfil com nome customizado
     */
    boolean existsByNomeCustomizado(String nomeCustomizado);

    /**
     * Busca perfis ativos
     */
    List<PerfilEntity> findByAtivoTrueOrderByTipo();

    /**
     * Busca todos ordenados por nível (do enum ou customizado)
     */
    @Query("SELECT p FROM PerfilEntity p ORDER BY " +
            "CASE WHEN p.nivelCustomizado IS NOT NULL THEN p.nivelCustomizado ELSE p.tipo END, " +
            "p.tipo")
    List<PerfilEntity> findAllOrderedByLevel();

    /**
     * Busca perfis que contém uma permissão específica
     */
    @Query("SELECT p FROM PerfilEntity p JOIN p.permissoes perm WHERE perm = :permissao AND p.ativo = true")
    List<PerfilEntity> findByPermissao(@Param("permissao") String permissao);

    /**
     * Busca perfis que podem acessar um módulo específico
     */
    @Query("SELECT p FROM PerfilEntity p JOIN p.modulos mod WHERE mod = :modulo AND p.ativo = true")
    List<PerfilEntity> findByModulo(@Param("modulo") String modulo);

    // Métodos de compatibilidade com o service atual
    default Optional<PerfilEntity> findByNome(String nome) {
        return findByNomeCustomizado(nome);
    }

    default boolean existsByNome(String nome) {
        return existsByNomeCustomizado(nome);
    }
}