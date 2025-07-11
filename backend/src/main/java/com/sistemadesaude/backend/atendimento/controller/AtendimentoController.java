package com.sistemadesaude.backend.atendimento.controller;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import com.sistemadesaude.backend.atendimento.service.AtendimentoService;
import com.sistemadesaude.backend.atendimento.service.AtendimentoPdfService;
import com.sistemadesaude.backend.verdepois.model.LogSistema;
import com.sistemadesaude.backend.verdepois.repository.LogSistemaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5011", "http://localhost:5012"})
@RequiredArgsConstructor
public class AtendimentoController {

    private final AtendimentoService atendimentoService; // ✅ Serviço correto
    private final AtendimentoPdfService pdfService;
    private final LogSistemaRepository logRepository;

    /**
     * Cria um novo atendimento
     */
    @PostMapping
    public Map<String, Object> criarAtendimento(@Valid @RequestBody AtendimentoDTO atendimentoDTO) {
        try {
            // Validações básicas
            if (atendimentoDTO.getPacienteId() == null || atendimentoDTO.getPacienteId().trim().isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "ID do paciente é obrigatório",
                        "data", null
                );
            }

            if (atendimentoDTO.getCid10() == null || atendimentoDTO.getCid10().trim().isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "CID10 é obrigatório",
                        "data", null
                );
            }

            System.out.println("💾 AtendimentoController: Criando atendimento para paciente: " + atendimentoDTO.getPacienteId());

            AtendimentoDTO salvo = atendimentoService.criarAtendimento(atendimentoDTO);

            // Log da operação
            LogSistema log = new LogSistema();
            log.setUsuarioId("sistema"); // TODO: Substituir pelo usuário logado
            log.setAcao("CRIAR_ATENDIMENTO");
            log.setTabela("atendimentos");
            log.setRegistroId(salvo.getId());
            logRepository.save(log);

            System.out.println("✅ AtendimentoController: Atendimento criado com sucesso, ID: " + salvo.getId());

            return Map.of(
                    "success", true,
                    "message", "Atendimento criado com sucesso",
                    "data", salvo
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.criarAtendimento: Erro: " + e.getMessage());
            e.printStackTrace();

            return Map.of(
                    "success", false,
                    "message", "Erro interno do servidor: " + e.getMessage(),
                    "data", null
            );
        }
    }

    /**
     * Lista atendimentos por paciente - MANTÉM COMPATIBILIDADE COM VERSÃO EXISTENTE
     */
    @GetMapping
    public Map<String, Object> listarPorPaciente(@RequestParam(required = false) String pacienteId) {
        try {
            if (pacienteId == null || pacienteId.trim().isEmpty()) {
                // Se não há pacienteId, lista todos
                System.out.println("🔍 AtendimentoController: Listando todos os atendimentos");
                List<AtendimentoDTO> lista = atendimentoService.listarTodos();

                return Map.of(
                        "success", true,
                        "message", "Atendimentos recuperados com sucesso",
                        "data", lista
                );
            }

            // Se há pacienteId, filtra por paciente
            String pacienteIdLimpo = pacienteId.trim();
            System.out.println("🔍 AtendimentoController: Buscando atendimentos para paciente ID: " + pacienteIdLimpo);

            List<AtendimentoDTO> lista = atendimentoService.buscarPorPaciente(pacienteIdLimpo);

            System.out.println("📊 AtendimentoController: " + lista.size() + " atendimento(s) encontrado(s)");

            return Map.of(
                    "success", true,
                    "message", "Atendimentos recuperados com sucesso",
                    "data", lista
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.listarPorPaciente: Erro: " + e.getMessage());
            e.printStackTrace();

            return Map.of(
                    "success", false,
                    "message", "Erro interno do servidor: " + e.getMessage(),
                    "data", Collections.emptyList()
            );
        }
    }

    /**
     * Nova rota específica para paciente - ADICIONAL
     */
    @GetMapping("/paciente/{pacienteId}")
    public Map<String, Object> buscarPorPaciente(@PathVariable String pacienteId) {
        try {
            if (pacienteId == null || pacienteId.trim().isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "ID do paciente é obrigatório",
                        "data", Collections.emptyList()
                );
            }

            String pacienteIdLimpo = pacienteId.trim();
            System.out.println("🔍 AtendimentoController: Buscando atendimentos para paciente ID: " + pacienteIdLimpo);

            List<AtendimentoDTO> lista = atendimentoService.buscarPorPaciente(pacienteIdLimpo);

            return Map.of(
                    "success", true,
                    "message", "Atendimentos do paciente recuperados",
                    "data", lista
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.buscarPorPaciente: Erro: " + e.getMessage());

            return Map.of(
                    "success", false,
                    "message", "Erro ao buscar atendimentos: " + e.getMessage(),
                    "data", Collections.emptyList()
            );
        }
    }

    /**
     * Busca atendimento por ID
     */
    @GetMapping("/{id}")
    public Map<String, Object> buscarPorId(@PathVariable String id) {
        try {
            System.out.println("🔍 AtendimentoController: Buscando atendimento ID: " + id);

            AtendimentoDTO atendimento = atendimentoService.buscarPorId(id);

            return Map.of(
                    "success", true,
                    "message", "Atendimento encontrado",
                    "data", atendimento
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.buscarPorId: Erro: " + e.getMessage());

            return Map.of(
                    "success", false,
                    "message", "Atendimento não encontrado",
                    "data", null
            );
        }
    }

    /**
     * Atualiza um atendimento
     */
    @PutMapping("/{id}")
    public Map<String, Object> atualizarAtendimento(@PathVariable String id, @Valid @RequestBody AtendimentoDTO atendimentoDTO) {
        try {
            System.out.println("🔄 AtendimentoController: Atualizando atendimento ID: " + id);

            AtendimentoDTO atualizado = atendimentoService.atualizarAtendimento(id, atendimentoDTO);

            // Log da operação
            LogSistema log = new LogSistema();
            log.setUsuarioId("sistema");
            log.setAcao("ATUALIZAR_ATENDIMENTO");
            log.setTabela("atendimentos");
            log.setRegistroId(id);
            logRepository.save(log);

            return Map.of(
                    "success", true,
                    "message", "Atendimento atualizado com sucesso",
                    "data", atualizado
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.atualizarAtendimento: Erro: " + e.getMessage());

            return Map.of(
                    "success", false,
                    "message", "Erro ao atualizar atendimento: " + e.getMessage(),
                    "data", null
            );
        }
    }

    /**
     * Exclui um atendimento
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> excluirAtendimento(@PathVariable String id) {
        try {
            System.out.println("🗑️ AtendimentoController: Excluindo atendimento ID: " + id);

            atendimentoService.excluirAtendimento(id);

            // Log da operação
            LogSistema log = new LogSistema();
            log.setUsuarioId("sistema");
            log.setAcao("EXCLUIR_ATENDIMENTO");
            log.setTabela("atendimentos");
            log.setRegistroId(id);
            logRepository.save(log);

            return Map.of(
                    "success", true,
                    "message", "Atendimento excluído com sucesso",
                    "data", null
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.excluirAtendimento: Erro: " + e.getMessage());

            return Map.of(
                    "success", false,
                    "message", "Erro ao excluir atendimento: " + e.getMessage(),
                    "data", null
            );
        }
    }

    /**
     * Gera PDF de um atendimento específico
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> gerarPdf(@PathVariable String id) {
        try {
            System.out.println("📄 AtendimentoController: Gerando PDF para atendimento: " + id);

            AtendimentoDTO atendimentoDTO = atendimentoService.buscarPorId(id);

            // Converter DTO para Entity para o serviço PDF
            Atendimento atendimento = Atendimento.builder()
                    .id(atendimentoDTO.getId())
                    .pacienteId(atendimentoDTO.getPacienteId())
                    .cid10(atendimentoDTO.getCid10())
                    .diagnostico(atendimentoDTO.getDiagnostico())
                    .prescricao(atendimentoDTO.getPrescricao())
                    .observacoes(atendimentoDTO.getObservacoes())
                    .dataHora(atendimentoDTO.getDataHora())
                    .build();

            byte[] pdf = pdfService.gerarPdf(atendimento);

            System.out.println("✅ AtendimentoController: PDF gerado com sucesso");

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=atendimento_" + id + ".pdf")
                    .body(pdf);

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.gerarPdf: Erro: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Busca atendimentos por período
     */
    @GetMapping("/periodo")
    public Map<String, Object> listarPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        try {
            System.out.println("📅 AtendimentoController: Buscando atendimentos por período: " + dataInicio + " a " + dataFim);

            // Converter strings para LocalDateTime
            LocalDateTime inicio = LocalDateTime.parse(dataInicio + "T00:00:00");
            LocalDateTime fim = LocalDateTime.parse(dataFim + "T23:59:59");

            List<AtendimentoDTO> lista = atendimentoService.buscarPorPeriodo(inicio, fim);

            return Map.of(
                    "success", true,
                    "message", "Atendimentos por período recuperados",
                    "data", lista
            );

        } catch (Exception e) {
            System.err.println("❌ AtendimentoController.listarPorPeriodo: Erro: " + e.getMessage());

            return Map.of(
                    "success", false,
                    "message", "Erro ao buscar atendimentos por período: " + e.getMessage(),
                    "data", Collections.emptyList()
            );
        }
    }
}