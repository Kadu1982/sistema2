package com.sistemadesaude.backend.perfilacesso.mapper;

import com.sistemadesaude.backend.perfilacesso.dto.PerfilDTO;
import com.sistemadesaude.backend.perfilacesso.entity.Perfil;
import com.sistemadesaude.backend.perfilacesso.entity.PerfilEntity;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T18:00:01-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Azul Systems, Inc.)"
)
@Component
public class PerfilMapperImpl implements PerfilMapper {

    @Override
    public PerfilDTO toDTO(PerfilEntity entity) {
        if ( entity == null ) {
            return null;
        }

        PerfilDTO.PerfilDTOBuilder perfilDTO = PerfilDTO.builder();

        perfilDTO.codigo( entityTipoCodigo( entity ) );
        perfilDTO.id( entity.getId() );
        perfilDTO.tipo( entity.getTipo() );
        perfilDTO.nomeCustomizado( entity.getNomeCustomizado() );
        perfilDTO.descricao( entity.getDescricao() );
        perfilDTO.ativo( entity.getAtivo() );
        perfilDTO.nivelCustomizado( entity.getNivelCustomizado() );
        Set<String> set = entity.getPermissoes();
        if ( set != null ) {
            perfilDTO.permissoes( new LinkedHashSet<String>( set ) );
        }
        Set<String> set1 = entity.getModulos();
        if ( set1 != null ) {
            perfilDTO.modulos( new LinkedHashSet<String>( set1 ) );
        }
        perfilDTO.sistemaPerfil( entity.getSistemaPerfil() );
        perfilDTO.dataCriacao( entity.getDataCriacao() );
        perfilDTO.dataAtualizacao( entity.getDataAtualizacao() );
        perfilDTO.criadoPor( entity.getCriadoPor() );
        perfilDTO.atualizadoPor( entity.getAtualizadoPor() );

        perfilDTO.nomeExibicao( entity.getNomeExibicao() );
        perfilDTO.nivel( entity.getNivel() );
        perfilDTO.isAdmin( entity.isAdmin() );
        perfilDTO.isProfissionalSaude( entity.isProfissionalSaude() );

        return perfilDTO.build();
    }

    @Override
    public List<PerfilDTO> toDTOList(List<PerfilEntity> entities) {
        if ( entities == null ) {
            return null;
        }

        List<PerfilDTO> list = new ArrayList<PerfilDTO>( entities.size() );
        for ( PerfilEntity perfilEntity : entities ) {
            list.add( toDTO( perfilEntity ) );
        }

        return list;
    }

    @Override
    public PerfilEntity toEntity(PerfilDTO dto) {
        if ( dto == null ) {
            return null;
        }

        PerfilEntity.PerfilEntityBuilder perfilEntity = PerfilEntity.builder();

        perfilEntity.tipo( dto.getTipo() );
        perfilEntity.nomeCustomizado( dto.getNomeCustomizado() );
        perfilEntity.descricao( dto.getDescricao() );
        perfilEntity.ativo( dto.getAtivo() );
        perfilEntity.nivelCustomizado( dto.getNivelCustomizado() );
        Set<String> set = dto.getPermissoes();
        if ( set != null ) {
            perfilEntity.permissoes( new LinkedHashSet<String>( set ) );
        }
        Set<String> set1 = dto.getModulos();
        if ( set1 != null ) {
            perfilEntity.modulos( new LinkedHashSet<String>( set1 ) );
        }
        perfilEntity.sistemaPerfil( dto.getSistemaPerfil() );
        perfilEntity.criadoPor( dto.getCriadoPor() );
        perfilEntity.atualizadoPor( dto.getAtualizadoPor() );

        return perfilEntity.build();
    }

    @Override
    public void updateEntityFromDTO(PerfilEntity entity, PerfilDTO dto) {
        if ( dto == null ) {
            return;
        }

        entity.setNomeCustomizado( dto.getNomeCustomizado() );
        entity.setDescricao( dto.getDescricao() );
        entity.setAtivo( dto.getAtivo() );
        entity.setNivelCustomizado( dto.getNivelCustomizado() );
        if ( entity.getPermissoes() != null ) {
            Set<String> set = dto.getPermissoes();
            if ( set != null ) {
                entity.getPermissoes().clear();
                entity.getPermissoes().addAll( set );
            }
            else {
                entity.setPermissoes( null );
            }
        }
        else {
            Set<String> set = dto.getPermissoes();
            if ( set != null ) {
                entity.setPermissoes( new LinkedHashSet<String>( set ) );
            }
        }
        if ( entity.getModulos() != null ) {
            Set<String> set1 = dto.getModulos();
            if ( set1 != null ) {
                entity.getModulos().clear();
                entity.getModulos().addAll( set1 );
            }
            else {
                entity.setModulos( null );
            }
        }
        else {
            Set<String> set1 = dto.getModulos();
            if ( set1 != null ) {
                entity.setModulos( new LinkedHashSet<String>( set1 ) );
            }
        }
        entity.setSistemaPerfil( dto.getSistemaPerfil() );
        entity.setAtualizadoPor( dto.getAtualizadoPor() );
    }

    private String entityTipoCodigo(PerfilEntity perfilEntity) {
        if ( perfilEntity == null ) {
            return null;
        }
        Perfil tipo = perfilEntity.getTipo();
        if ( tipo == null ) {
            return null;
        }
        String codigo = tipo.getCodigo();
        if ( codigo == null ) {
            return null;
        }
        return codigo;
    }
}
