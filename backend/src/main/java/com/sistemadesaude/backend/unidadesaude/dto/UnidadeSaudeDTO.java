package com.sistemadesaude.backend.unidadesaude.dto;

import com.sistemadesaude.backend.unidadesaude.entity.TipoUnidadeSaude;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferência de dados de Unidade de Saúde
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnidadeSaudeDTO {

    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @NotBlank(message = "Código CNES é obrigatório")
    @Pattern(regexp = "\\d{7}", message = "Código CNES deve ter 7 dígitos")
    private String codigoCnes;

    @NotNull(message = "Tipo da unidade é obrigatório")
    private TipoUnidadeSaude tipo;

    @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
    private String endereco;

    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos")
    private String cep;

    @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
    private String cidade;

    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
    private String estado;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;

    private Boolean ativa;

    @Size(max = 200, message = "Horário de funcionamento deve ter no máximo 200 caracteres")
    private String horarioFuncionamento;

    @Size(max = 100, message = "Gestor responsável deve ter no máximo 100 caracteres")
    private String gestorResponsavel;

    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private String criadoPor;
    private String atualizadoPor;

    // Campos calculados
    private String tipoDescricao;
    private String enderecoCompleto;

    // Métodos de conveniência
    public String getTipoDescricao() {
        return tipo != null ? tipo.getDescricao() : null;
    }

    public String getEnderecoCompleto() {
        StringBuilder sb = new StringBuilder();
        if (endereco != null) sb.append(endereco);
        if (cidade != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(cidade);
        }
        if (estado != null) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(estado);
        }
        if (cep != null) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(cep);
        }
        return sb.toString();
    }
}