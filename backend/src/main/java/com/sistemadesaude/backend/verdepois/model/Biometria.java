package com.sistemadesaude.backend.verdepois.model;

import com.sistemadesaude.backend.operador.entity.Operador;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "biometrias")
public class Biometria {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operador_id", nullable = false)
    private Operador operador;

    @Column(name = "template_id", nullable = false)
    private String templateId;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @Column(name = "dispositivo_id")
    private String dispositivoId;

    @Column(name = "data_captura")
    private LocalDateTime dataCaptura;

    @Column(name = "ativo")
    private Boolean ativo;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        dataCaptura = LocalDateTime.now();
        ativo = true;
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // Construtores
    public Biometria() {}

    public Biometria(Operador operador, String templateId, String tipo, String dispositivoId) {
        this.operador = operador;
        this.templateId = templateId;
        this.tipo = tipo;
        this.dispositivoId = dispositivoId;
    }

    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Operador getOperador() {
        return operador;
    }

    public void setOperador(Operador operador) {
        this.operador = operador;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDispositivoId() {
        return dispositivoId;
    }

    public void setDispositivoId(String dispositivoId) {
        this.dispositivoId = dispositivoId;
    }

    public LocalDateTime getDataCaptura() {
        return dataCaptura;
    }

    public void setDataCaptura(LocalDateTime dataCaptura) {
        this.dataCaptura = dataCaptura;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}