package com.sistemadesaude.backend.unidadesaude.mapper;

import com.sistemadesaude.backend.unidadesaude.dto.UnidadeSaudeDTO;
import com.sistemadesaude.backend.unidadesaude.entity.UnidadeSaude;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

/**
 * Mapper para conversão entre UnidadeSaude e UnidadeSaudeDTO
 * Utiliza MapStruct para geração automática das implementações
 */
@Mapper(componentModel = "spring")
public interface UnidadeSaudeMapper {

    /**
     * Converte entidade UnidadeSaude para DTO completo
     * Os campos calculados são mapeados através de expressões
     */
    @Named("toDTO")
    @Mapping(target = "tipoDescricao", expression = "java(entity.getTipo() != null ? entity.getTipo().getDescricao() : null)")
    @Mapping(target = "enderecoCompleto", expression = "java(buildEnderecoCompleto(entity))")
    UnidadeSaudeDTO toDTO(UnidadeSaude entity);

    /**
     * Converte lista de entidades para lista de DTOs completos
     */
    @Named("toDTOList")
    List<UnidadeSaudeDTO> toDTOList(List<UnidadeSaude> entities);

    /**
     * Converte DTO para entidade UnidadeSaude
     * Ignora campos de auditoria que são gerenciados automaticamente
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    UnidadeSaude toEntity(UnidadeSaudeDTO dto);

    /**
     * Atualiza entidade existente com dados do DTO
     * Preserva ID e dados de auditoria da criação
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    void updateEntityFromDTO(@MappingTarget UnidadeSaude entity, UnidadeSaudeDTO dto);

    /**
     * Converte DTO para entidade simples (apenas campos básicos)
     * Útil para criação rápida com poucos dados
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "endereco", ignore = true)
    @Mapping(target = "cep", ignore = true)
    @Mapping(target = "cidade", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "telefone", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "horarioFuncionamento", ignore = true)
    @Mapping(target = "gestorResponsavel", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "atualizadoPor", ignore = true)
    UnidadeSaude toEntitySimples(UnidadeSaudeDTO dto);

    /**
     * Converte entidade para DTO resumido (apenas campos essenciais)
     * Útil para listagens ou seleções
     */
    @Named("toDTOResumido")
    @Mapping(target = "endereco", ignore = true)
    @Mapping(target = "cep", ignore = true)
    @Mapping(target = "telefone", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "horarioFuncionamento", ignore = true)
    @Mapping(target = "gestorResponsavel", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "atualizadoPor", ignore = true)
    @Mapping(target = "tipoDescricao", expression = "java(entity.getTipo() != null ? entity.getTipo().getDescricao() : null)")
    @Mapping(target = "enderecoCompleto", expression = "java(buildEnderecoResumido(entity))")
    UnidadeSaudeDTO toDTOResumido(UnidadeSaude entity);

    /**
     * Converte lista de entidades para lista de DTOs resumidos
     */
    @Named("toDTOResumidoList")
    List<UnidadeSaudeDTO> toDTOResumidoList(List<UnidadeSaude> entities);

    /**
     * Método auxiliar para construir endereço completo
     * Utilizado nas expressões de mapeamento
     */
    default String buildEnderecoCompleto(UnidadeSaude entity) {
        if (entity == null) return null;

        StringBuilder sb = new StringBuilder();

        if (entity.getEndereco() != null && !entity.getEndereco().trim().isEmpty()) {
            sb.append(entity.getEndereco());
        }

        if (entity.getCidade() != null && !entity.getCidade().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(entity.getCidade());
        }

        if (entity.getEstado() != null && !entity.getEstado().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(entity.getEstado().toUpperCase());
        }

        if (entity.getCep() != null && !entity.getCep().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" - CEP: ");
            // Formata CEP: 12345678 -> 12345-678
            String cep = entity.getCep().replaceAll("\\D", "");
            if (cep.length() == 8) {
                sb.append(cep.substring(0, 5)).append("-").append(cep.substring(5));
            } else {
                sb.append(cep);
            }
        }

        return sb.length() > 0 ? sb.toString() : null;
    }

    /**
     * Método auxiliar para construir endereço resumido (apenas cidade e estado)
     */
    default String buildEnderecoResumido(UnidadeSaude entity) {
        if (entity == null) return null;

        StringBuilder sb = new StringBuilder();

        if (entity.getCidade() != null && !entity.getCidade().trim().isEmpty()) {
            sb.append(entity.getCidade());
        }

        if (entity.getEstado() != null && !entity.getEstado().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(entity.getEstado().toUpperCase());
        }

        return sb.length() > 0 ? sb.toString() : null;
    }
}