package com.sistemadesaude.backend.verdepois.dto;

import com.sistemadesaude.backend.exames.dto.ProcedimentoSadtDTO;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SadtDTO {

    private Long id;
    private String numeroSadt;
    private Long agendamentoId;

    // Dados do estabelecimento
    private EstabelecimentoDTO estabelecimento;

    // Dados do paciente
    private PacienteResumoDTO paciente;

    // Dados do solicitante
    private SolicitanteDTO solicitante;

    // Dados da solicitação
    private SolicitacaoDTO solicitacao;

    private LocalDateTime criadoEm;
    private String criadoPor;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstabelecimentoDTO {
        private String nome;
        private String cnes;
        private String endereco;
        private String telefone;
        private String municipio;
        private String uf;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PacienteResumoDTO {
        private Long id;
        private String nome;
        private String cpf;
        private String cns;
        private String dataNascimento;
        private String sexo;
        private String endereco;
        private String telefone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SolicitanteDTO {
        private String nome;
        private String cbo;
        private String conselho;
        private String numeroConselho;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SolicitacaoDTO {
        private String numero;
        private LocalDateTime dataEmissao;
        private String tipoSadt;
        private List<ProcedimentoSadtDTO> procedimentos;
        private String observacoes;
        private Boolean urgente;
    }
}