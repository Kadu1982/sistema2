package com.sistemadesaude.backend.recepcao.mapper;

import com.sistemadesaude.backend.recepcao.dto.AgendamentoDTO;
import com.sistemadesaude.backend.recepcao.entity.Agendamento;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T18:00:01-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Azul Systems, Inc.)"
)
@Component
public class AgendamentoMapperImpl implements AgendamentoMapper {

    @Override
    public AgendamentoDTO toDTO(Agendamento entity) {
        if ( entity == null ) {
            return null;
        }

        AgendamentoDTO agendamentoDTO = new AgendamentoDTO();

        agendamentoDTO.setExamesSelecionados( stringToList( entity.getExamesSelecionados() ) );
        agendamentoDTO.setId( entity.getId() );
        agendamentoDTO.setPacienteId( entity.getPacienteId() );
        agendamentoDTO.setDataHora( entity.getDataHora() );
        agendamentoDTO.setStatus( entity.getStatus() );
        agendamentoDTO.setEspecialidade( entity.getEspecialidade() );
        agendamentoDTO.setPrioridade( entity.getPrioridade() );
        agendamentoDTO.setUnidade( entity.getUnidade() );
        agendamentoDTO.setObservacoes( entity.getObservacoes() );

        return agendamentoDTO;
    }

    @Override
    public Agendamento toEntity(AgendamentoDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Agendamento agendamento = new Agendamento();

        agendamento.setExamesSelecionados( listToString( dto.getExamesSelecionados() ) );
        agendamento.setId( dto.getId() );
        agendamento.setPacienteId( dto.getPacienteId() );
        agendamento.setDataHora( dto.getDataHora() );
        agendamento.setStatus( dto.getStatus() );
        agendamento.setEspecialidade( dto.getEspecialidade() );
        agendamento.setPrioridade( dto.getPrioridade() );
        agendamento.setObservacoes( dto.getObservacoes() );
        agendamento.setUnidade( dto.getUnidade() );

        return agendamento;
    }
}
