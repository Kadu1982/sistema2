package com.sistemadesaude.backend.operador.mapper;

import com.sistemadesaude.backend.operador.dto.OperadorDTO;
import com.sistemadesaude.backend.operador.dto.OperadorListDTO;
import com.sistemadesaude.backend.operador.entity.Operador;
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
public class OperadorMapperImpl implements OperadorMapper {

    @Override
    public OperadorDTO toDTO(Operador operador) {
        if ( operador == null ) {
            return null;
        }

        OperadorDTO.OperadorDTOBuilder operadorDTO = OperadorDTO.builder();

        operadorDTO.unidadeId( operador.getUnidadeSaudeId() );
        operadorDTO.unidadeAtualId( operador.getUnidadeAtualId() );
        operadorDTO.id( operador.getId() );
        operadorDTO.login( operador.getLogin() );
        operadorDTO.nome( operador.getNome() );
        operadorDTO.cargo( operador.getCargo() );
        operadorDTO.cpf( operador.getCpf() );
        operadorDTO.email( operador.getEmail() );
        operadorDTO.ativo( operador.getAtivo() );
        List<String> list = operador.getPerfis();
        if ( list != null ) {
            operadorDTO.perfis( new ArrayList<String>( list ) );
        }
        operadorDTO.isMaster( operador.getIsMaster() );
        operadorDTO.ultimoLogin( operador.getUltimoLogin() );
        operadorDTO.dataCriacao( operador.getDataCriacao() );
        operadorDTO.dataAtualizacao( operador.getDataAtualizacao() );
        operadorDTO.criadoPor( operador.getCriadoPor() );
        operadorDTO.atualizadoPor( operador.getAtualizadoPor() );

        operadorDTO.nomeUnidade( "" );
        operadorDTO.nomeUnidadeAtual( "" );

        return operadorDTO.build();
    }

    @Override
    public OperadorListDTO toListDTO(Operador operador) {
        if ( operador == null ) {
            return null;
        }

        OperadorListDTO.OperadorListDTOBuilder operadorListDTO = OperadorListDTO.builder();

        operadorListDTO.unidadeId( operador.getUnidadeSaudeId() );
        operadorListDTO.unidadeAtualId( operador.getUnidadeAtualId() );
        operadorListDTO.id( operador.getId() );
        operadorListDTO.login( operador.getLogin() );
        operadorListDTO.nome( operador.getNome() );
        operadorListDTO.cargo( operador.getCargo() );
        operadorListDTO.ativo( operador.getAtivo() );
        List<String> list = operador.getPerfis();
        if ( list != null ) {
            operadorListDTO.perfis( new ArrayList<String>( list ) );
        }
        operadorListDTO.isMaster( operador.getIsMaster() );
        operadorListDTO.ultimoLogin( operador.getUltimoLogin() );

        operadorListDTO.nomeUnidade( "" );
        operadorListDTO.nomeUnidadeAtual( "" );
        operadorListDTO.statusAcesso( operador.getStatusAcesso() );

        return operadorListDTO.build();
    }

    @Override
    public Operador toEntity(OperadorDTO operadorDTO) {
        if ( operadorDTO == null ) {
            return null;
        }

        Operador.OperadorBuilder operador = Operador.builder();

        operador.unidadeSaudeId( operadorDTO.getUnidadeId() );
        operador.unidadeAtualId( operadorDTO.getUnidadeAtualId() );
        operador.isMaster( operadorDTO.getIsMaster() );
        operador.login( operadorDTO.getLogin() );
        operador.nome( operadorDTO.getNome() );
        operador.cargo( operadorDTO.getCargo() );
        operador.cpf( operadorDTO.getCpf() );
        operador.email( operadorDTO.getEmail() );
        operador.ativo( operadorDTO.getAtivo() );
        List<String> list = operadorDTO.getPerfis();
        if ( list != null ) {
            operador.perfis( new ArrayList<String>( list ) );
        }

        return operador.build();
    }

    @Override
    public void updateEntityFromDTO(Operador operador, OperadorDTO operadorDTO) {
        if ( operadorDTO == null ) {
            return;
        }

        if ( operadorDTO.getUnidadeId() != null ) {
            operador.setUnidadeSaudeId( operadorDTO.getUnidadeId() );
        }
        if ( operadorDTO.getUnidadeAtualId() != null ) {
            operador.setUnidadeAtualId( operadorDTO.getUnidadeAtualId() );
        }
        if ( operadorDTO.getIsMaster() != null ) {
            operador.setIsMaster( operadorDTO.getIsMaster() );
        }
        if ( operadorDTO.getNome() != null ) {
            operador.setNome( operadorDTO.getNome() );
        }
        if ( operadorDTO.getCargo() != null ) {
            operador.setCargo( operadorDTO.getCargo() );
        }
        if ( operadorDTO.getCpf() != null ) {
            operador.setCpf( operadorDTO.getCpf() );
        }
        if ( operadorDTO.getEmail() != null ) {
            operador.setEmail( operadorDTO.getEmail() );
        }
        if ( operadorDTO.getAtivo() != null ) {
            operador.setAtivo( operadorDTO.getAtivo() );
        }
        if ( operador.getPerfis() != null ) {
            List<String> list = operadorDTO.getPerfis();
            if ( list != null ) {
                operador.getPerfis().clear();
                operador.getPerfis().addAll( list );
            }
        }
        else {
            List<String> list = operadorDTO.getPerfis();
            if ( list != null ) {
                operador.setPerfis( new ArrayList<String>( list ) );
            }
        }
        if ( operadorDTO.getAtualizadoPor() != null ) {
            operador.setAtualizadoPor( operadorDTO.getAtualizadoPor() );
        }
    }

    @Override
    public List<OperadorDTO> toDTOList(List<Operador> operadores) {
        if ( operadores == null ) {
            return null;
        }

        List<OperadorDTO> list = new ArrayList<OperadorDTO>( operadores.size() );
        for ( Operador operador : operadores ) {
            list.add( toDTO( operador ) );
        }

        return list;
    }

    @Override
    public List<OperadorListDTO> toListDTOList(List<Operador> operadores) {
        if ( operadores == null ) {
            return null;
        }

        List<OperadorListDTO> list = new ArrayList<OperadorListDTO>( operadores.size() );
        for ( Operador operador : operadores ) {
            list.add( toListDTO( operador ) );
        }

        return list;
    }
}
