package com.sistemadesaude.backend.shared.paciente.controller;

import com.sistemadesaude.backend.verdepois.dto.*;
import com.sistemadesaude.backend.exames.dto.GerarSadtRequest;
import com.sistemadesaude.backend.exames.dto.SadtResponseDTO;
import com.sistemadesaude.backend.service.SadtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/sadt")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class SadtController {

    private final SadtService sadtService;

    @PostMapping("/gerar")
    public ResponseEntity<SadtResponseDTO> gerarSadt(
            @Valid @RequestBody GerarSadtRequest request,
            Authentication authentication) {

        try {
            log.info("🏥 POST /api/sadt/gerar - Agendamento: {}", request.getAgendamentoId());

            String usuarioLogado = authentication != null ? authentication.getName() : "Sistema";

            SadtResponseDTO response = sadtService.gerarSadt(request, usuarioLogado);

            log.info("✅ SADT {} gerada com sucesso", response.getNumeroSadt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Erro ao gerar SADT: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(SadtResponseDTO.builder()
                            .numeroSadt("ERRO")
                            .pdfBase64("")
                            .build());
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<SadtDTO>> buscarSadtsPorPaciente(@PathVariable Long pacienteId) {
        try {
            log.info("🔍 GET /api/sadt/paciente/{} - Buscando SADTs", pacienteId);

            List<SadtDTO> sadts = sadtService.buscarSadtsPorPaciente(pacienteId);

            log.info("✅ Encontradas {} SADTs para o paciente {}", sadts.size(), pacienteId);

            return ResponseEntity.ok(sadts);

        } catch (Exception e) {
            log.error("❌ Erro ao buscar SADTs do paciente {}: {}", pacienteId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{numeroSadt}/pdf")
    public ResponseEntity<byte[]> downloadSadtPdf(@PathVariable String numeroSadt) {
        try {
            log.info("📥 GET /api/sadt/{}/pdf - Download PDF", numeroSadt);

            byte[] pdfBytes = sadtService.downloadSadtPdf(numeroSadt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "SADT_" + numeroSadt + ".pdf");
            headers.setContentLength(pdfBytes.length);

            log.info("✅ Download PDF da SADT {} concluído", numeroSadt);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            log.error("❌ Erro ao fazer download da SADT {}: {}", numeroSadt, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}