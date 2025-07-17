package com.sistemadesaude.backend.paciente.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sistemadesaude.backend.paciente.dto.PacienteDTO;
import com.sistemadesaude.backend.paciente.dto.PacienteListDTO;
import com.sistemadesaude.backend.paciente.service.PacienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PacienteController.class)
@AutoConfigureMockMvc(addFilters = false)
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PacienteService service;

    @Test
    void criarPacienteRetornaCreated() throws Exception {
        PacienteDTO dto = PacienteDTO.builder().id(1L).nomeCompleto("Fulano").build();
        when(service.criarPaciente(any())).thenReturn(dto);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void buscarPacientePorIdNaoEncontradoRetorna404() throws Exception {
        when(service.buscarPacientePorId(5L)).thenThrow(new com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException("nao"));

        mockMvc.perform(get("/api/pacientes/5"))
                .andExpect(status().isNotFound());
    }
}
