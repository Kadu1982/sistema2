package com.sistemadesaude.backend.atendimento.mapper;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import org.mapstruct.Mapper;

/**
 * Mapper para converter entre Atendimento e AtendimentoDTO.
 */
@Mapper(componentModel = "spring")
public interface AtendimentoMapper {

    AtendimentoDTO toDTO(Atendimento entity);

    Atendimento toEntity(AtendimentoDTO dto);
}