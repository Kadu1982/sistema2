package com.sistemadesaude.backend.operador.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "operador") // Recomendado usar o plural para nomes de tabelas
@Getter
@Setter
@ToString(exclude = {"perfis"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Operador implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cargo")
    private String cargo;

    @Column(name = "cpf", unique = true)
    private String cpf;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // ✅ CORREÇÃO: Campos de ID da unidade adicionados para consistência com o DTO e o Mapper.
    // Eram estes campos que faltavam e causavam o erro de compilação.
    /**
     * ID da unidade de saúde de lotação do operador.
     */
    @Column(name = "unidade_saude_id")
    private Long unidadeSaudeId;

    /**
     * ID da unidade de saúde em que o operador está atualmente logado.
     */
    @Column(name = "unidade_atual_id")
    private Long unidadeAtualId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "operador_perfis", joinColumns = @JoinColumn(name = "operador_id"))
    @Column(name = "perfil")
    @Builder.Default
    private List<String> perfis = new java.util.ArrayList<>();

    @Column(name = "is_master", nullable = false)
    private Boolean isMaster = false;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

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

    // Métodos UserDetails (sem alterações)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.perfis.stream()
                .map(perfil -> new SimpleGrantedAuthority("ROLE_" + perfil.toUpperCase()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.ativo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.ativo;
    }

    // Métodos de negócio e helpers (sem alterações)
    public boolean isMasterUser() {
        return this.isMaster != null && this.isMaster;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Operador operador = (Operador) o;
        return id != null && Objects.equals(id, operador.id);
    }

    @Override
    public final int hashCode() {
        return getClass().hashCode();
    }

    public List<Long> getUnidadesComAcesso() {
        List<Long> unidades = new java.util.ArrayList<>();

        // Adiciona a unidade de lotação do operador, se existir
        if (unidadeSaudeId != null) {
            unidades.add(unidadeSaudeId);
        }

        // Adiciona a unidade atual do operador, se existir e for diferente da unidade de lotação
        if (unidadeAtualId != null && !unidadeAtualId.equals(unidadeSaudeId)) {
            unidades.add(unidadeAtualId);
        }

        return unidades;
    }

    /**
     * Retorna o status de acesso baseado no último login
     */
    public String getStatusAcesso() {
        if (ultimoLogin == null) {
            return "Nunca logou";
        }

        // Considera online se logou nas últimas 30 minutos
        LocalDateTime agora = LocalDateTime.now();
        if (ultimoLogin.isAfter(agora.minusMinutes(30))) {
            return "Online";
        }

        return "Offline";
    }

    /**
     * Verifica se o operador tem acesso a uma unidade específica
     * @param unidadeId ID da unidade a verificar
     * @return true se o operador tem acesso à unidade, false caso contrário
     */
    public boolean temAcessoAUnidade(Long unidadeId) {
        if (unidadeId == null) {
            return false;
        }

        // Administradores têm acesso a todas as unidades
        if (this.isMasterUser()) {
            return true;
        }

        // Verifica se é a unidade de lotação do operador
        if (this.unidadeSaudeId != null && this.unidadeSaudeId.equals(unidadeId)) {
            return true;
        }

        // Verifica se é a unidade atual do operador
        if (this.unidadeAtualId != null && this.unidadeAtualId.equals(unidadeId)) {
            return true;
        }

        return false;
    }
}
