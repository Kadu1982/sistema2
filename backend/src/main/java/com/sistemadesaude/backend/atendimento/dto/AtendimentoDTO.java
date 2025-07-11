package com.sistemadesaude.backend.atendimento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferência de dados de Atendimento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtendimentoDTO {

    private String id;
    private String pacienteId;
    private String cid10;
    private String diagnostico;
    private String prescricao;
    private String observacoes;
    private LocalDateTime dataHora;
}