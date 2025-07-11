package com.sistemadesaude.backend.verdepois.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_sistema")
public class LogSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String usuarioId;
    private String acao;
    private String tabela;
    private String registroId;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters e Setters

    public String getId() {
        return id;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public String getTabela() {
        return tabela;
    }

    public void setTabela(String tabela) {
        this.tabela = tabela;
    }

    public String getRegistroId() {
        return registroId;
    }

    public void setRegistroId(String registroId) {
        this.registroId = registroId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
