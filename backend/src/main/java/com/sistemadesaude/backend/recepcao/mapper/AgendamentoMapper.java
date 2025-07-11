
package com.sistemadesaude.backend.recepcao.mapper;

import com.sistemadesaude.backend.recepcao.dto.AgendamentoDTO;
import com.sistemadesaude.backend.recepcao.entity.Agendamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Mapper para converter entre Agendamento e AgendamentoDTO.
 */
@Mapper(componentModel = "spring")
public interface AgendamentoMapper {

    @Mapping(source = "examesSelecionados", target = "examesSelecionados", qualifiedByName = "stringToList")
    AgendamentoDTO toDTO(Agendamento entity);

    @Mapping(source = "examesSelecionados", target = "examesSelecionados", qualifiedByName = "listToString")
    Agendamento toEntity(AgendamentoDTO dto);

    /**
     * Converte String separada por vírgulas para List<String>
     * @param examesSelecionados String no formato "exame1,exame2,exame3"
     * @return Lista de strings ou lista vazia se null/empty
     */
    @Named("stringToList")
    default List<String> stringToList(String examesSelecionados) {
        if (examesSelecionados == null || examesSelecionados.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.asList(examesSelecionados.split(","));
    }

    /**
     * Converte List<String> para String separada por vírgulas
     * @param examesSelecionados Lista de exames
     * @return String no formato "exame1,exame2,exame3" ou null se lista vazia
     */
    @Named("listToString")
    default String listToString(List<String> examesSelecionados) {
        if (examesSelecionados == null || examesSelecionados.isEmpty()) {
            return null;
        }
        return String.join(",", examesSelecionados);
    }
}