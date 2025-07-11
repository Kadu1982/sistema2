package com.sistemadesaude.backend.perfilacesso.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade que representa um perfil de acesso no sistema
 */
@Entity
@Table(name = "perfis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo do perfil baseado no enum
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, unique = true)
    private Perfil tipo;

    /**
     * Nome customizado do perfil (opcional)
     */
    @Column(name = "nome_customizado", length = 100)
    private String nomeCustomizado;

    /**
     * Descrição específica desta instância do perfil
     */
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    /**
     * Se o perfil está ativo
     */
    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    /**
     * Nível hierárquico customizado (senão usa do enum)
     */
    @Column(name = "nivel_customizado")
    private Integer nivelCustomizado;

    /**
     * Lista de permissões específicas deste perfil
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "perfil_acesso_permissoes",
            joinColumns = @JoinColumn(name = "perfil_id")
    )
    @Column(name = "permissao")
    @Builder.Default
    private Set<String> permissoes = new HashSet<>();

    /**
     * Módulos que o perfil pode acessar
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "perfil_acesso_modulos",
            joinColumns = @JoinColumn(name = "perfil_id")
    )
    @Column(name = "modulo")
    @Builder.Default
    private Set<String> modulos = new HashSet<>();

    /**
     * Indica se o perfil é um perfil de sistema (não pode ser excluído)
     */
    @Column(name = "sistema_perfil")
    @Builder.Default
    private Boolean sistemaPerfil = false;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "criado_por", length = 50)
    private String criadoPor;

    @Column(name = "atualizado_por", length = 50)
    private String atualizadoPor;

    // Métodos de conveniência

    /**
     * Retorna o nome a ser exibido (customizado ou do enum)
     */
    public String getNomeExibicao() {
        return nomeCustomizado != null ? nomeCustomizado : tipo.getDescricao();
    }

    /**
     * Retorna o código do perfil
     */
    public String getCodigo() {
        return tipo.getCodigo();
    }

    /**
     * Retorna o nível hierárquico (customizado ou do enum)
     */
    public Integer getNivel() {
        return nivelCustomizado != null ? nivelCustomizado : tipo.getNivel();
    }

    /**
     * Verifica se tem uma permissão específica
     */
    public boolean temPermissao(String permissao) {
        return permissoes != null && permissoes.contains(permissao.toUpperCase());
    }

    /**
     * Verifica se pode acessar um módulo
     */
    public boolean podeAcessarModulo(String modulo) {
        return modulos != null && modulos.contains(modulo.toUpperCase());
    }

    /**
     * Adiciona uma permissão
     */
    public void adicionarPermissao(String permissao) {
        if (permissoes == null) permissoes = new HashSet<>();
        permissoes.add(permissao.toUpperCase());
    }

    /**
     * Adiciona um módulo
     */
    public void adicionarModulo(String modulo) {
        if (modulos == null) modulos = new HashSet<>();
        modulos.add(modulo.toUpperCase());
    }

    /**
     * Remove uma permissão
     */
    public void removerPermissao(String permissao) {
        if (permissoes != null) {
            permissoes.remove(permissao.toUpperCase());
        }
    }

    /**
     * Remove um módulo
     */
    public void removerModulo(String modulo) {
        if (modulos != null) {
            modulos.remove(modulo.toUpperCase());
        }
    }

    /**
     * Verifica se é perfil administrativo
     */
    public boolean isAdmin() {
        return tipo.isAdmin();
    }

    /**
     * Verifica se é profissional de saúde
     */
    public boolean isProfissionalSaude() {
        return tipo.isProfissionalSaude();
    }
}