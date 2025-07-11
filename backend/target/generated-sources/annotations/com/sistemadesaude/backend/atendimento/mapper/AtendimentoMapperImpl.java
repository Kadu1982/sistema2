package com.sistemadesaude.backend.atendimento.mapper;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T18:00:01-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Azul Systems, Inc.)"
)
@Component
public class AtendimentoMapperImpl implements AtendimentoMapper {

    @Override
    public AtendimentoDTO toDTO(Atendimento entity) {
        if ( entity == null ) {
            return null;
        }

        AtendimentoDTO.AtendimentoDTOBuilder atendimentoDTO = AtendimentoDTO.builder();

        atendimentoDTO.id( entity.getId() );
        atendimentoDTO.pacienteId( entity.getPacienteId() );
        atendimentoDTO.cid10( entity.getCid10() );
        atendimentoDTO.diagnostico( entity.getDiagnostico() );
        atendimentoDTO.prescricao( entity.getPrescricao() );
        atendimentoDTO.observacoes( entity.getObservacoes() );
        atendimentoDTO.dataHora( entity.getDataHora() );

        return atendimentoDTO.build();
    }

    @Override
    public Atendimento toEntity(AtendimentoDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Atendimento.AtendimentoBuilder atendimento = Atendimento.builder();

        atendimento.id( dto.getId() );
        atendimento.pacienteId( dto.getPacienteId() );
        atendimento.cid10( dto.getCid10() );
        atendimento.diagnostico( dto.getDiagnostico() );
        atendimento.prescricao( dto.getPrescricao() );
        atendimento.observacoes( dto.getObservacoes() );
        atendimento.dataHora( dto.getDataHora() );

        return atendimento.build();
    }
}
