package com.sistemadesaude.backend.recepcao.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "agendamentos") // Define a tabela vinculada a essa entidade
@Data
public class Agendamento {

    // 🔑 ID auto-incrementado (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 ID do paciente (agora referencia tabela 'pacientes')
    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    // 🏷️ Tipo do atendimento: ex: "consulta_medica", "exame_laboratorial"
    @Column(name = "tipo_atendimento", nullable = false)
    private String tipoAtendimento;

    // 🕓 Data e hora marcada para o atendimento
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    // ✅ Status: "AGENDADO", "REALIZADO", "CANCELADO"
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "especialidade")
    private String especialidade;

    @Column(name = "prioridade")
    private String prioridade;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "unidade")
    private String unidade;

    @Column(name = "exames_selecionados", columnDefinition = "TEXT")
    private String examesSelecionados;

    // ✅ MÉTODOS HELPER para trabalhar com lista de exames
    @Transient
    public List<String> getExamesSelecionadosList() {
        if (examesSelecionados == null || examesSelecionados.trim().isEmpty()) {
            return List.of();
        }
        return List.of(examesSelecionados.split(","));
    }

    public void setExamesSelecionadosList(List<String> exames) {
        if (exames == null || exames.isEmpty()) {
            this.examesSelecionados = null;
        } else {
            this.examesSelecionados = String.join(",", exames);
        }
    }
}
