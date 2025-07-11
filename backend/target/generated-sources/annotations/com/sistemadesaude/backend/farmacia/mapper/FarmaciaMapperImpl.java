package com.sistemadesaude.backend.farmacia.mapper;

import com.sistemadesaude.backend.farmacia.dto.FarmaciaDTO;
import com.sistemadesaude.backend.farmacia.entity.Farmacia;
import com.sistemadesaude.backend.unidadesaude.entity.UnidadeSaude;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T18:00:01-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Azul Systems, Inc.)"
)
@Component
public class FarmaciaMapperImpl implements FarmaciaMapper {

    @Override
    public FarmaciaDTO toDTO(Farmacia entity) {
        if ( entity == null ) {
            return null;
        }

        FarmaciaDTO.FarmaciaDTOBuilder farmaciaDTO = FarmaciaDTO.builder();

        farmaciaDTO.unidadeSaudeId( entityUnidadeSaudeId( entity ) );
        farmaciaDTO.id( entity.getId() );
        farmaciaDTO.nome( entity.getNome() );
        farmaciaDTO.responsavelTecnico( entity.getResponsavelTecnico() );
        farmaciaDTO.telefone( entity.getTelefone() );

        return farmaciaDTO.build();
    }

    @Override
    public Farmacia toEntity(FarmaciaDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Farmacia.FarmaciaBuilder farmacia = Farmacia.builder();

        farmacia.id( dto.getId() );
        farmacia.nome( dto.getNome() );
        farmacia.responsavelTecnico( dto.getResponsavelTecnico() );
        farmacia.telefone( dto.getTelefone() );

        return farmacia.build();
    }

    private Long entityUnidadeSaudeId(Farmacia farmacia) {
        if ( farmacia == null ) {
            return null;
        }
        UnidadeSaude unidadeSaude = farmacia.getUnidadeSaude();
        if ( unidadeSaude == null ) {
            return null;
        }
        Long id = unidadeSaude.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
