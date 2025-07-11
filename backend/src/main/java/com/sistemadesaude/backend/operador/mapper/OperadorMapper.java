package com.sistemadesaude.backend.operador.mapper;

import com.sistemadesaude.backend.operador.dto.OperadorDTO;
import com.sistemadesaude.backend.operador.dto.OperadorListDTO;
import com.sistemadesaude.backend.operador.entity.Operador;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre a entidade Operador e seus DTOs.
 * Esta versão foi corrigida para refletir a estrutura real da entidade,
 * mapeando IDs diretamente e deixando a resolução de nomes para a camada de serviço.
 */
@Mapper(componentModel = "spring")
public interface OperadorMapper {

    // --- MÉTODOS DE ENTIDADE PARA DTO ---

    /**
     * Converte a entidade Operador para o OperadorDTO completo.
     * A senha é ignorada por segurança.
     * Os nomes das unidades são deixados em branco para serem preenchidos pelo service.
     */
    @Mapping(target = "senha", ignore = true)
    @Mapping(source = "unidadeSaudeId", target = "unidadeId")
    @Mapping(source = "unidadeAtualId", target = "unidadeAtualId")
    @Mapping(target = "nomeUnidade", constant = "")
    @Mapping(target = "nomeUnidadeAtual", constant = "")
    OperadorDTO toDTO(Operador operador);

    /**
     * Converte a entidade Operador para o OperadorListDTO (versão para listas).
     * O status de acesso é calculado diretamente pelo método da entidade.
     */
    @Mapping(source = "unidadeSaudeId", target = "unidadeId")
    @Mapping(source = "unidadeAtualId", target = "unidadeAtualId")
    @Mapping(target = "nomeUnidade", constant = "")
    @Mapping(target = "nomeUnidadeAtual", constant = "")
    @Mapping(target = "statusAcesso", expression = "java(operador.getStatusAcesso())")
    OperadorListDTO toListDTO(Operador operador);


    // --- MÉTODOS DE DTO PARA ENTIDADE ---

    /**
     * Converte um OperadorDTO para a entidade Operador.
     * Campos de controle (id, datas, etc.) e a senha são ignorados,
     * pois são gerenciados pelo banco de dados ou pelo service.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "senha", ignore = true)
    @Mapping(source = "unidadeId", target = "unidadeSaudeId")
    @Mapping(source = "unidadeAtualId", target = "unidadeAtualId")
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    @Mapping(target = "ultimoLogin", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "atualizadoPor", ignore = true)
    @Mapping(target = "isMaster", source="isMaster") // Ajuste se o nome do campo for "isMaster" no DTO
    Operador toEntity(OperadorDTO operadorDTO);

    /**
     * Atualiza uma entidade Operador existente com dados de um OperadorDTO.
     * Apenas os campos presentes no DTO (não nulos) serão atualizados.
     * Campos sensíveis ou de controle não são alterados.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "login", ignore = true)
    @Mapping(target = "senha", ignore = true)
    @Mapping(source = "unidadeId", target = "unidadeSaudeId")
    @Mapping(source = "unidadeAtualId", target = "unidadeAtualId")
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "dataAtualizacao", ignore = true)
    @Mapping(target = "criadoPor", ignore = true)
    @Mapping(target = "ultimoLogin", ignore = true)
    @Mapping(target = "isMaster", source="isMaster")
    void updateEntityFromDTO(@MappingTarget Operador operador, OperadorDTO operadorDTO);


    // --- CONVERSÃO DE LISTAS ---

    List<OperadorDTO> toDTOList(List<Operador> operadores);

    List<OperadorListDTO> toListDTOList(List<Operador> operadores);
}