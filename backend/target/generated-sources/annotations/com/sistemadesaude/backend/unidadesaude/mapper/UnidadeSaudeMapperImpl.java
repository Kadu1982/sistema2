package com.sistemadesaude.backend.unidadesaude.mapper;

import com.sistemadesaude.backend.unidadesaude.dto.UnidadeSaudeDTO;
import com.sistemadesaude.backend.unidadesaude.entity.UnidadeSaude;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T18:00:01-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Azul Systems, Inc.)"
)
@Component
public class UnidadeSaudeMapperImpl implements UnidadeSaudeMapper {

    @Override
    public UnidadeSaudeDTO toDTO(UnidadeSaude entity) {
        if ( entity == null ) {
            return null;
        }

        UnidadeSaudeDTO.UnidadeSaudeDTOBuilder unidadeSaudeDTO = UnidadeSaudeDTO.builder();

        unidadeSaudeDTO.id( entity.getId() );
        unidadeSaudeDTO.nome( entity.getNome() );
        unidadeSaudeDTO.codigoCnes( entity.getCodigoCnes() );
        unidadeSaudeDTO.tipo( entity.getTipo() );
        unidadeSaudeDTO.endereco( entity.getEndereco() );
        unidadeSaudeDTO.cep( entity.getCep() );
        unidadeSaudeDTO.cidade( entity.getCidade() );
        unidadeSaudeDTO.estado( entity.getEstado() );
        unidadeSaudeDTO.telefone( entity.getTelefone() );
        unidadeSaudeDTO.email( entity.getEmail() );
        unidadeSaudeDTO.ativa( entity.getAtiva() );
        unidadeSaudeDTO.horarioFuncionamento( entity.getHorarioFuncionamento() );
        unidadeSaudeDTO.gestorResponsavel( entity.getGestorResponsavel() );
        unidadeSaudeDTO.dataCriacao( entity.getDataCriacao() );
        unidadeSaudeDTO.dataAtualizacao( entity.getDataAtualizacao() );
        unidadeSaudeDTO.criadoPor( entity.getCriadoPor() );
        unidadeSaudeDTO.atualizadoPor( entity.getAtualizadoPor() );

        unidadeSaudeDTO.tipoDescricao( entity.getTipo() != null ? entity.getTipo().getDescricao() : null );
        unidadeSaudeDTO.enderecoCompleto( buildEnderecoCompleto(entity) );

        return unidadeSaudeDTO.build();
    }

    @Override
    public List<UnidadeSaudeDTO> toDTOList(List<UnidadeSaude> entities) {
        if ( entities == null ) {
            return null;
        }

        List<UnidadeSaudeDTO> list = new ArrayList<UnidadeSaudeDTO>( entities.size() );
        for ( UnidadeSaude unidadeSaude : entities ) {
            list.add( unidadeSaudeToUnidadeSaudeDTO( unidadeSaude ) );
        }

        return list;
    }

    @Override
    public UnidadeSaude toEntity(UnidadeSaudeDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UnidadeSaude.UnidadeSaudeBuilder unidadeSaude = UnidadeSaude.builder();

        unidadeSaude.nome( dto.getNome() );
        unidadeSaude.codigoCnes( dto.getCodigoCnes() );
        unidadeSaude.tipo( dto.getTipo() );
        unidadeSaude.endereco( dto.getEndereco() );
        unidadeSaude.cep( dto.getCep() );
        unidadeSaude.cidade( dto.getCidade() );
        unidadeSaude.estado( dto.getEstado() );
        unidadeSaude.telefone( dto.getTelefone() );
        unidadeSaude.email( dto.getEmail() );
        unidadeSaude.ativa( dto.getAtiva() );
        unidadeSaude.horarioFuncionamento( dto.getHorarioFuncionamento() );
        unidadeSaude.gestorResponsavel( dto.getGestorResponsavel() );
        unidadeSaude.criadoPor( dto.getCriadoPor() );
        unidadeSaude.atualizadoPor( dto.getAtualizadoPor() );

        return unidadeSaude.build();
    }

    @Override
    public void updateEntityFromDTO(UnidadeSaude entity, UnidadeSaudeDTO dto) {
        if ( dto == null ) {
            return;
        }

        entity.setNome( dto.getNome() );
        entity.setCodigoCnes( dto.getCodigoCnes() );
        entity.setTipo( dto.getTipo() );
        entity.setEndereco( dto.getEndereco() );
        entity.setCep( dto.getCep() );
        entity.setCidade( dto.getCidade() );
        entity.setEstado( dto.getEstado() );
        entity.setTelefone( dto.getTelefone() );
        entity.setEmail( dto.getEmail() );
        entity.setAtiva( dto.getAtiva() );
        entity.setHorarioFuncionamento( dto.getHorarioFuncionamento() );
        entity.setGestorResponsavel( dto.getGestorResponsavel() );
        entity.setAtualizadoPor( dto.getAtualizadoPor() );
    }

    @Override
    public UnidadeSaude toEntitySimples(UnidadeSaudeDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UnidadeSaude.UnidadeSaudeBuilder unidadeSaude = UnidadeSaude.builder();

        unidadeSaude.nome( dto.getNome() );
        unidadeSaude.codigoCnes( dto.getCodigoCnes() );
        unidadeSaude.tipo( dto.getTipo() );
        unidadeSaude.ativa( dto.getAtiva() );

        return unidadeSaude.build();
    }

    @Override
    public UnidadeSaudeDTO toDTOResumido(UnidadeSaude entity) {
        if ( entity == null ) {
            return null;
        }

        UnidadeSaudeDTO.UnidadeSaudeDTOBuilder unidadeSaudeDTO = UnidadeSaudeDTO.builder();

        unidadeSaudeDTO.id( entity.getId() );
        unidadeSaudeDTO.nome( entity.getNome() );
        unidadeSaudeDTO.codigoCnes( entity.getCodigoCnes() );
        unidadeSaudeDTO.tipo( entity.getTipo() );
        unidadeSaudeDTO.cidade( entity.getCidade() );
        unidadeSaudeDTO.estado( entity.getEstado() );
        unidadeSaudeDTO.ativa( entity.getAtiva() );

        unidadeSaudeDTO.tipoDescricao( entity.getTipo() != null ? entity.getTipo().getDescricao() : null );
        unidadeSaudeDTO.enderecoCompleto( buildEnderecoResumido(entity) );

        return unidadeSaudeDTO.build();
    }

    @Override
    public List<UnidadeSaudeDTO> toDTOResumidoList(List<UnidadeSaude> entities) {
        if ( entities == null ) {
            return null;
        }

        List<UnidadeSaudeDTO> list = new ArrayList<UnidadeSaudeDTO>( entities.size() );
        for ( UnidadeSaude unidadeSaude : entities ) {
            list.add( unidadeSaudeToUnidadeSaudeDTO( unidadeSaude ) );
        }

        return list;
    }

    protected UnidadeSaudeDTO unidadeSaudeToUnidadeSaudeDTO(UnidadeSaude unidadeSaude) {
        if ( unidadeSaude == null ) {
            return null;
        }

        UnidadeSaudeDTO.UnidadeSaudeDTOBuilder unidadeSaudeDTO = UnidadeSaudeDTO.builder();

        unidadeSaudeDTO.id( unidadeSaude.getId() );
        unidadeSaudeDTO.nome( unidadeSaude.getNome() );
        unidadeSaudeDTO.codigoCnes( unidadeSaude.getCodigoCnes() );
        unidadeSaudeDTO.tipo( unidadeSaude.getTipo() );
        unidadeSaudeDTO.endereco( unidadeSaude.getEndereco() );
        unidadeSaudeDTO.cep( unidadeSaude.getCep() );
        unidadeSaudeDTO.cidade( unidadeSaude.getCidade() );
        unidadeSaudeDTO.estado( unidadeSaude.getEstado() );
        unidadeSaudeDTO.telefone( unidadeSaude.getTelefone() );
        unidadeSaudeDTO.email( unidadeSaude.getEmail() );
        unidadeSaudeDTO.ativa( unidadeSaude.getAtiva() );
        unidadeSaudeDTO.horarioFuncionamento( unidadeSaude.getHorarioFuncionamento() );
        unidadeSaudeDTO.gestorResponsavel( unidadeSaude.getGestorResponsavel() );
        unidadeSaudeDTO.dataCriacao( unidadeSaude.getDataCriacao() );
        unidadeSaudeDTO.dataAtualizacao( unidadeSaude.getDataAtualizacao() );
        unidadeSaudeDTO.criadoPor( unidadeSaude.getCriadoPor() );
        unidadeSaudeDTO.atualizadoPor( unidadeSaude.getAtualizadoPor() );

        return unidadeSaudeDTO.build();
    }
}
