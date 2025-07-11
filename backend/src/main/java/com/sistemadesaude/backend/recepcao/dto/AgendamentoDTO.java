package com.sistemadesaude.backend.recepcao.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * DTO para retornar dados do agendamento para o frontend
 */
@Data
public class AgendamentoDTO {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;

    @JsonIgnore
    private LocalDateTime pacienteDataNascimento;

    private String profissionalNome;

    @JsonIgnore
    private LocalDateTime dataHora;

    private String status;
    private String tipo;

    // Métodos para serializar datas como strings para o frontend
    @JsonProperty("pacienteDataNascimento")
    public String getPacienteDataNascimentoFormatado() {
        return pacienteDataNascimento != null ? 
            pacienteDataNascimento.format(DateTimeFormatter.ISO_DATE) : null;
    }

    @JsonProperty("dataHora")
    public String getDataHoraFormatada() {
        return dataHora != null ? 
            dataHora.format(DateTimeFormatter.ISO_DATE_TIME) : null;
    }

    // ✅ CAMPOS EXISTENTES
    private String especialidade;
    private String prioridade;
    private String unidade;
    private String observacoes;

    // ✅ CAMPO: Lista de exames selecionados
    private List<String> examesSelecionados;

    // ✅ NOVOS CAMPOS: Informações de SADT
    private Boolean precisaSadt;
    private Boolean temSadt;

    // Construtor principal
    public AgendamentoDTO(Long id, Long pacienteId, String pacienteNome, LocalDateTime pacienteDataNascimento, String profissionalNome,
                          LocalDateTime dataHora, String status, String tipo) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.pacienteNome = pacienteNome;
        this.pacienteDataNascimento = pacienteDataNascimento;
        this.profissionalNome = profissionalNome;
        this.dataHora = dataHora;
        this.status = status;
        this.tipo = tipo;
    }

    // Construtor sem data de nascimento (para compatibilidade)
    public AgendamentoDTO(Long id, Long pacienteId, String pacienteNome, String profissionalNome,
                          LocalDateTime dataHora, String status, String tipo) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.pacienteNome = pacienteNome;
        this.profissionalNome = profissionalNome;
        this.dataHora = dataHora;
        this.status = status;
        this.tipo = tipo;
    }

    // Construtor para compatibilidade com código existente
    public AgendamentoDTO(Long id, String pacienteNome, LocalDateTime pacienteDataNascimento, String profissionalNome,
                          LocalDateTime dataHora, String status, String tipo) {
        this.id = id;
        this.pacienteNome = pacienteNome;
        this.pacienteDataNascimento = pacienteDataNascimento;
        this.profissionalNome = profissionalNome;
        this.dataHora = dataHora;
        this.status = status;
        this.tipo = tipo;
    }

    // Construtor sem data de nascimento e sem pacienteId (para compatibilidade)
    public AgendamentoDTO(Long id, String pacienteNome, String profissionalNome,
                          LocalDateTime dataHora, String status, String tipo) {
        this.id = id;
        this.pacienteNome = pacienteNome;
        this.profissionalNome = profissionalNome;
        this.dataHora = dataHora;
        this.status = status;
        this.tipo = tipo;
    }

    // Construtor vazio
    public AgendamentoDTO() {}
}
