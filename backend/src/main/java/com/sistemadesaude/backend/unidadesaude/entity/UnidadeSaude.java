package com.sistemadesaude.backend.unidadesaude.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidade que representa uma Unidade de Saúde no sistema
 */
@Entity
@Table(name = "unidades_saude")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnidadeSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome da unidade de saúde
     */
    @Column(name = "nome", nullable = false, length = 200)
    private String nome;

    /**
     * Código CNES (Cadastro Nacional de Estabelecimentos de Saúde)
     */
    @Column(name = "codigo_cnes", length = 7, nullable = false, unique = true)
    private String codigoCnes;

    /**
     * Tipo da unidade (UBS, Hospital, Clínica, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    @Builder.Default
    private TipoUnidadeSaude tipo = TipoUnidadeSaude.UBS;

    /**
     * Endereço completo da unidade
     */
    @Column(name = "endereco", length = 500)
    private String endereco;

    /**
     * CEP da unidade
     */
    @Column(name = "cep", length = 8)
    private String cep;

    /**
     * Cidade onde está localizada
     */
    @Column(name = "cidade", length = 100)
    private String cidade;

    /**
     * Estado (UF)
     */
    @Column(name = "estado", length = 2)
    private String estado;

    /**
     * Telefone da unidade
     */
    @Column(name = "telefone", length = 20)
    private String telefone;

    /**
     * Email da unidade
     */
    @Column(name = "email", length = 100)
    private String email;

    /**
     * Se a unidade está ativa no sistema
     */
    @Column(name = "ativa", nullable = false)
    @Builder.Default
    private Boolean ativa = true;

    /**
     * Horário de funcionamento
     */
    @Column(name = "horario_funcionamento", length = 200)
    private String horarioFuncionamento;

    /**
     * Gestor responsável pela unidade
     */
    @Column(name = "gestor_responsavel", length = 100)
    private String gestorResponsavel;

    /**
     * Data de criação do registro
     */
    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    /**
     * Data da última atualização
     */
    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    /**
     * Usuário que criou o registro
     */
    @Column(name = "criado_por", length = 50)
    private String criadoPor;

    /**
     * Usuário que fez a última atualização
     */
    @Column(name = "atualizado_por", length = 50)
    private String atualizadoPor;

    // Construtor adicional para facilitar criação
    public UnidadeSaude(String nome, String codigoCnes) {
        this.nome = nome;
        this.codigoCnes = codigoCnes;
        this.ativa = true;
        this.tipo = TipoUnidadeSaude.UBS;
    }

    /**
     * Construtor para criação básica com tipo
     */
    public UnidadeSaude(String nome, String codigoCnes, TipoUnidadeSaude tipo) {
        this.nome = nome;
        this.codigoCnes = codigoCnes;
        this.tipo = tipo;
        this.ativa = true;
    }
}