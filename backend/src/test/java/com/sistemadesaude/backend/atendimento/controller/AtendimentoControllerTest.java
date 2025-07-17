package com.sistemadesaude.backend.atendimento.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.service.AtendimentoPdfService;
import com.sistemadesaude.backend.atendimento.service.AtendimentoService;
import com.sistemadesaude.backend.verdepois.repository.LogSistemaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AtendimentoController.class)
@AutoConfigureMockMvc(addFilters = false)
class AtendimentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AtendimentoService service;
    @MockBean
    private AtendimentoPdfService pdfService;
    @MockBean
    private LogSistemaRepository logRepo;

    @Test
    void criarAtendimentoRetornaSucesso() throws Exception {
        AtendimentoDTO dto = AtendimentoDTO.builder()
                .id("1").pacienteId("p1").cid10("A00")
                .dataHora(LocalDateTime.now()).build();
        when(service.criarAtendimento(any())).thenReturn(dto);

        mockMvc.perform(post("/api/atendimentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void buscarPorIdRetornaAtendimento() throws Exception {
        AtendimentoDTO dto = AtendimentoDTO.builder().id("1").pacienteId("p1").cid10("A00").build();
        when(service.buscarPorId("1")).thenReturn(dto);

        mockMvc.perform(get("/api/atendimentos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("1"));
    }
}
