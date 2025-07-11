
package com.sistemadesaude.backend.recepcao.controller;

import com.sistemadesaude.backend.recepcao.dto.AgendamentoDTO;
import com.sistemadesaude.backend.recepcao.dto.NovoAgendamentoRequest;
import com.sistemadesaude.backend.recepcao.service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5011", "http://localhost:5012"})
@RequiredArgsConstructor
@Slf4j
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @GetMapping
    public ResponseEntity<List<AgendamentoDTO>> listarTodos() {
        List<AgendamentoDTO> agendamentos = agendamentoService.listarTodos();
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/por-paciente/{pacienteId}")
    public ResponseEntity<List<AgendamentoDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        List<AgendamentoDTO> agendamentos = agendamentoService.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/por-data")
    public ResponseEntity<List<AgendamentoDTO>> listarPorData(@RequestParam String data) {
        log.info("Buscando agendamentos para a data: {}", data);

        LocalDate localDate = LocalDate.parse(data.substring(0, 10));
        List<AgendamentoDTO> agendamentos = agendamentoService.listarPorData(localDate);

        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoDTO> buscarPorId(@PathVariable Long id) {
        AgendamentoDTO agendamento = agendamentoService.buscarPorId(id);
        return ResponseEntity.ok(agendamento);
    }

    @PostMapping
    public ResponseEntity<AgendamentoDTO> criar(@RequestBody NovoAgendamentoRequest request) {
        log.info("Criando novo agendamento para paciente ID: {}", request.getPacienteId());

        AgendamentoDTO agendamento = agendamentoService.criarAgendamento(request);

        return ResponseEntity.created(URI.create("/api/agendamentos/" + agendamento.getId()))
                .body(agendamento);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoDTO> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        log.info("Atualizando status do agendamento ID: {} para {}", id, request.get("status"));

        AgendamentoDTO agendamento = agendamentoService.atualizarStatus(id, request.get("status"));
        return ResponseEntity.ok(agendamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id, @RequestBody(required = false) Map<String, String> request) {
        log.info("Cancelando agendamento ID: {}", id);

        agendamentoService.atualizarStatus(id, "CANCELADO");
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para verificar se agendamento precisa de SADT
     */
    @GetMapping("/{id}/precisa-sadt")
    public ResponseEntity<Map<String, Object>> verificarSadt(@PathVariable Long id) {
        try {
            boolean precisaSadt = agendamentoService.precisaSadt(id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "precisaSadt", precisaSadt,
                    "temSadt", false, // TODO: Implementar verificação se já tem SADT
                    "podeGerar", precisaSadt
            ));

        } catch (Exception e) {
            log.error("Erro ao verificar SADT para agendamento {}: {}", id, e.getMessage());

            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Erro ao verificar SADT: " + e.getMessage(),
                    "precisaSadt", false,
                    "temSadt", false,
                    "podeGerar", false
            ));
        }
    }
}