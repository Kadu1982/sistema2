package com.sistemadesaude.backend.atendimento.service;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import com.sistemadesaude.backend.atendimento.mapper.AtendimentoMapper;
import com.sistemadesaude.backend.atendimento.repository.AtendimentoRepository;
import com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AtendimentoServiceImplTest {

    @Mock
    private AtendimentoRepository repository;

    private AtendimentoMapper mapper = Mappers.getMapper(AtendimentoMapper.class);

    private AtendimentoServiceImpl service;

    @BeforeEach
    void setup() {
        service = new AtendimentoServiceImpl(repository, mapper);
    }

    @Test
    void criarAtendimentoGeraDataQuandoNecessario() {
        AtendimentoDTO dto = AtendimentoDTO.builder()
                .pacienteId("1")
                .cid10("A00")
                .build();

        Atendimento saved = Atendimento.builder()
                .id("2")
                .pacienteId("1")
                .cid10("A00")
                .dataHora(LocalDateTime.now())
                .build();

        when(repository.save(any(Atendimento.class))).thenReturn(saved);

        AtendimentoDTO result = service.criarAtendimento(dto);
        assertNotNull(result.getDataHora());
        verify(repository).save(any(Atendimento.class));
    }

    @Test
    void buscarPorIdInexistenteLancaExcecao() {
        when(repository.findById("x")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.buscarPorId("x"));
    }

    @Test
    void atualizarAtendimentoPersisteAlteracoes() {
        Atendimento existente = Atendimento.builder()
                .id("1").pacienteId("p1").cid10("B00").build();
        when(repository.findById("1")).thenReturn(Optional.of(existente));

        Atendimento salvo = Atendimento.builder()
                .id("1").pacienteId("p1").cid10("B01").build();
        when(repository.save(any(Atendimento.class))).thenReturn(salvo);

        AtendimentoDTO dto = AtendimentoDTO.builder().cid10("B01").build();
        AtendimentoDTO result = service.atualizarAtendimento("1", dto);
        assertEquals("B01", result.getCid10());
    }

    @Test
    void excluirAtendimentoNaoExistenteLancaExcecao() {
        when(repository.existsById("99")).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.excluirAtendimento("99"));
    }
}
