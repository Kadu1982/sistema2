package com.sistemadesaude.backend.paciente.service;

import com.sistemadesaude.backend.paciente.dto.PacienteDTO;
import com.sistemadesaude.backend.paciente.dto.PacienteListDTO;
import com.sistemadesaude.backend.paciente.entity.Paciente;
import com.sistemadesaude.backend.paciente.mapper.PacienteMapper;
import com.sistemadesaude.backend.paciente.repository.PacienteRepository;
import com.sistemadesaude.backend.verdepois.exception.BusinessException;
import com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PacienteServiceImplTest {

    @Mock
    private PacienteRepository repository;

    private PacienteMapper mapper = Mappers.getMapper(PacienteMapper.class);

    private PacienteServiceImpl service;

    @BeforeEach
    void setup() {
        service = new PacienteServiceImpl(repository, mapper);
    }

    @Test
    void criarPacienteSalvaEntidade() {
        PacienteDTO dto = PacienteDTO.builder()
                .nomeCompleto("Fulano")
                .cpf("123")
                .cns("321")
                .build();
        Paciente saved = Paciente.builder()
                .id(1L)
                .nomeCompleto("Fulano")
                .cpf("123")
                .cns("321")
                .build();

        when(repository.existsByCpf("123")).thenReturn(false);
        when(repository.existsByCns("321")).thenReturn(false);
        when(repository.save(any(Paciente.class))).thenReturn(saved);

        PacienteDTO result = service.criarPaciente(dto);

        assertEquals(1L, result.getId());
        ArgumentCaptor<Paciente> captor = ArgumentCaptor.forClass(Paciente.class);
        verify(repository).save(captor.capture());
        assertEquals("Fulano", captor.getValue().getNomeCompleto());
    }

    @Test
    void criarPacienteComCpfDuplicadoDisparaExcecao() {
        PacienteDTO dto = PacienteDTO.builder().cpf("123").build();
        when(repository.existsByCpf("123")).thenReturn(true);
        assertThrows(BusinessException.class, () -> service.criarPaciente(dto));
    }

    @Test
    void buscarPacientePorIdInexistenteLancaExcecao() {
        when(repository.findById(5L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.buscarPacientePorId(5L));
    }

    @Test
    void excluirPacienteNaoEncontradoLancaExcecao() {
        when(repository.existsById(9L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.excluirPaciente(9L));
    }

    @Test
    void buscarPacientesPorNomeRetornaLista() {
        Paciente pac1 = Paciente.builder().id(1L).nomeCompleto("Ana").build();
        Paciente pac2 = Paciente.builder().id(2L).nomeCompleto("Anabel").build();
        when(repository.findByNomeCompletoContainingIgnoreCase("Ana"))
                .thenReturn(Arrays.asList(pac1, pac2));

        List<PacienteListDTO> lista = service.buscarPacientesPorNome("Ana");
        assertEquals(2, lista.size());
        assertEquals("Ana", lista.get(0).getNomeCompleto());
    }

    @Test
    void verificarVulnerabilidadeAnalisaCampos() {
        Paciente pac = Paciente.builder().id(1L).acamado(true).build();
        when(repository.findById(1L)).thenReturn(Optional.of(pac));
        assertTrue(service.verificarVulnerabilidade(1L));
    }
}
