package com.sistemadesaude.backend.service;

import com.sistemadesaude.backend.documentos.Sadt;
import com.sistemadesaude.backend.exames.entity.ProcedimentoSadt;
import com.sistemadesaude.backend.paciente.entity.Paciente;
import com.sistemadesaude.backend.verdepois.dto.*;
import com.sistemadesaude.backend.exames.dto.GerarSadtRequest;
import com.sistemadesaude.backend.exames.dto.ProcedimentoSadtDTO;
import com.sistemadesaude.backend.exames.dto.SadtResponseDTO;
import com.sistemadesaude.backend.paciente.repository.PacienteRepository;
import com.sistemadesaude.backend.verdepois.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class SadtService {

    private final SadtRepository sadtRepository;
    private final PacienteRepository pacienteRepository;
    private final SadtPdfService sadtPdfService;

    @Transactional
    public SadtResponseDTO gerarSadt(GerarSadtRequest request, String usuarioLogado) {
        try {
            log.info("🏥 Iniciando geração de SADT para recepcao: {}", request.getAgendamentoId());

            // ✅ CORRIGIDO: Buscar o paciente do recepcao
            Long pacienteId = request.getPacienteId() != null ? request.getPacienteId() : 1L;

            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + pacienteId));

            log.info("👤 Paciente encontrado: {} (ID: {})", paciente.getNomeCompleto(), paciente.getId());

            // 2. Gerar número da SADT
            String numeroSadt = gerarNumeroSadt();

            // 3. Determinar tipo SADT
            Sadt.TipoSadt tipoSadt = determinarTipoSadt(request.getProcedimentos());

            // 4. ✅ CORRIGIDO: Criar entidade SADT com pacienteId em vez de paciente
            Sadt sadt = Sadt.builder()
                    .numeroSadt(numeroSadt)
                    .agendamentoId(request.getAgendamentoId())
                    .pacienteId(paciente.getId()) // ✅ CORRIGIDO: usar pacienteId

                    // Dados do estabelecimento (configuráveis)
                    .estabelecimentoNome("UBS Central")
                    .estabelecimentoCnes("7654321")
                    .estabelecimentoEndereco("Rua Principal, 123 - Centro")
                    .estabelecimentoTelefone("(11) 3333-4444")
                    .estabelecimentoMunicipio("São Paulo")
                    .estabelecimentoUf("SP")

                    // Dados do solicitante (simular médico)
                    .solicitanteNome("Dr. João Silva")
                    .solicitanteCbo("225125")
                    .solicitanteConselho("CRM")
                    .solicitanteNumeroConselho("123456")

                    // Dados da solicitação
                    .dataEmissao(LocalDateTime.now())
                    .tipoSadt(tipoSadt)
                    .observacoes(request.getObservacoes())
                    .urgente(request.getUrgente())
                    .operador(usuarioLogado) // ✅ CORRIGIDO: usar operador em vez de criadoPor
                    .build();

            // 5. Salvar SADT
            Sadt sadtSalva = sadtRepository.save(sadt);

            // 6. ✅ CORRIGIDO: Criar procedimentos com nomes corretos dos campos
            List<ProcedimentoSadt> procedimentos = request.getProcedimentos().stream()
                    .map(proc -> ProcedimentoSadt.builder()
                            .sadt(sadtSalva)
                            .codigoSigtap(proc.getCodigo()) // ✅ CORRIGIDO: usar codigoSigtap
                            .nomeProcedimento(proc.getNome()) // ✅ CORRIGIDO: usar nomeProcedimento
                            .quantidade(proc.getQuantidade())
                            .cid10(proc.getCid10())
                            .justificativa(proc.getJustificativa())
                            .preparo(proc.getPreparo())
                            .autorizado(true) // ✅ ADICIONAR: auto autorizar
                            .build())
                    .collect(Collectors.toList());

            sadtSalva.setProcedimentos(procedimentos);
            sadtRepository.save(sadtSalva);

            // 7. Gerar PDF
            SadtDTO sadtDto = converterParaDTO(sadtSalva, paciente);

            // ✅ MODIFICADO: Garantir que estamos usando o template mais recente
            log.info("🔄 Gerando PDF com o template mais recente para SADT: {}", numeroSadt);
            byte[] pdfBytes = sadtPdfService.gerarPdf(sadtDto);

            // 8. ✅ CORRIGIDO: Salvar PDF na entidade usando campo correto
            sadtSalva.setPdfBase64(java.util.Base64.getEncoder().encodeToString(pdfBytes));
            sadtRepository.save(sadtSalva);

            log.info("✅ PDF gerado com sucesso usando o template mais recente");

            log.info("✅ SADT {} gerada com sucesso!", numeroSadt);

            return SadtResponseDTO.builder()
                    .numeroSadt(numeroSadt)
                    .pdfBase64(java.util.Base64.getEncoder().encodeToString(pdfBytes))
                    .sadtData(sadtDto)
                    .build();

        } catch (Exception e) {
            log.error("❌ Erro ao gerar SADT: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao gerar SADT: " + e.getMessage());
        }
    }

    public List<SadtDTO> buscarSadtsPorPaciente(Long pacienteId) {
        log.info("🔍 Buscando SADTs do paciente: {}", pacienteId);

        List<Sadt> sadts = sadtRepository.findByPacienteIdOrderByDataEmissaoDesc(pacienteId);

        return sadts.stream()
                .map(sadt -> {
                    Paciente paciente = pacienteRepository.findById(sadt.getPacienteId())
                            .orElse(null);
                    return converterParaDTO(sadt, paciente);
                })
                .collect(Collectors.toList());
    }

    public byte[] downloadSadtPdf(String numeroSadt) {
        log.info("📥 Download PDF da SADT: {}", numeroSadt);

        Sadt sadt = sadtRepository.findByNumeroSadt(numeroSadt)
                .orElseThrow(() -> new RuntimeException("SADT não encontrada: " + numeroSadt));

        // ✅ MODIFICADO: Sempre gerar um novo PDF para garantir que as alterações no template sejam aplicadas
        log.info("🔄 Regenerando PDF para SADT: {}", numeroSadt);
        Paciente paciente = pacienteRepository.findById(sadt.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        SadtDTO sadtDto = converterParaDTO(sadt, paciente);
        byte[] pdfBytes = sadtPdfService.gerarPdf(sadtDto);

        // Atualizar o PDF armazenado
        sadt.setPdfBase64(java.util.Base64.getEncoder().encodeToString(pdfBytes));
        sadtRepository.save(sadt);

        log.info("✅ PDF regenerado com sucesso para SADT: {}", numeroSadt);

        return pdfBytes;
    }

    // ✅ CORRIGIDO: Método simplificado para gerar número SADT
    private String gerarNumeroSadt() {
        LocalDateTime now = LocalDateTime.now();
        String prefixo = "SADT" + now.format(DateTimeFormatter.ofPattern("yyyyMM"));

        // ✅ CORRIGIDO: Usar método que existe no repository
        long count = sadtRepository.countByNumeroSadtStartingWith(prefixo);

        return String.format("%s%06d", prefixo, count + 1);
    }

    private Sadt.TipoSadt determinarTipoSadt(List<GerarSadtRequest.ProcedimentoRequest> procedimentos) {
        // Lógica simples baseada no código SIGTAP
        String primeiroCodigo = procedimentos.get(0).getCodigo();

        if (primeiroCodigo.startsWith("0202")) {
            return Sadt.TipoSadt.LABORATORIAL;
        } else if (primeiroCodigo.startsWith("0204")) {
            return Sadt.TipoSadt.IMAGEM;
        } else {
            return Sadt.TipoSadt.TERAPEUTICO;
        }
    }

    // ✅ MÉTODO CORRIGIDO: recebe paciente como parâmetro
    private SadtDTO converterParaDTO(Sadt sadt, Paciente paciente) {
        return SadtDTO.builder()
                .id(sadt.getId())
                .numeroSadt(sadt.getNumeroSadt())
                .agendamentoId(sadt.getAgendamentoId())

                .estabelecimento(SadtDTO.EstabelecimentoDTO.builder()
                        .nome(sadt.getEstabelecimentoNome())
                        .cnes(sadt.getEstabelecimentoCnes())
                        .endereco(sadt.getEstabelecimentoEndereco())
                        .telefone(sadt.getEstabelecimentoTelefone())
                        .municipio(sadt.getEstabelecimentoMunicipio())
                        .uf(sadt.getEstabelecimentoUf())
                        .build())

                .paciente(paciente != null ? SadtDTO.PacienteResumoDTO.builder()
                        .id(paciente.getId())
                        .nome(paciente.getNomeCompleto())
                        .cpf(paciente.getCpf())
                        .cns(paciente.getCns())
                        .dataNascimento(paciente.getDataNascimento() != null
                                ? paciente.getDataNascimento().toString()
                                : null)
                        .sexo(paciente.getSexo())
                        .endereco(paciente.getLogradouro())
                        .telefone(paciente.getTelefoneCelular())
                        .build() : null)

                .solicitante(SadtDTO.SolicitanteDTO.builder()
                        .nome(sadt.getSolicitanteNome())
                        .cbo(sadt.getSolicitanteCbo())
                        .conselho(sadt.getSolicitanteConselho())
                        .numeroConselho(sadt.getSolicitanteNumeroConselho())
                        .build())

                .solicitacao(SadtDTO.SolicitacaoDTO.builder()
                        .numero(sadt.getNumeroSadt())
                        .dataEmissao(sadt.getDataEmissao())
                        .tipoSadt(sadt.getTipoSadt().getValor())
                        .observacoes(sadt.getObservacoes())
                        .urgente(sadt.getUrgente())
                        .procedimentos(sadt.getProcedimentos() != null ?
                                sadt.getProcedimentos().stream()
                                        .map(this::converterProcedimentoParaDTO)
                                        .collect(Collectors.toList()) :
                                List.of())
                        .build())

                .criadoEm(sadt.getCreatedAt()) // ✅ CORRIGIDO: usar campo correto
                .criadoPor(sadt.getOperador()) // ✅ CORRIGIDO: usar operador
                .build();
    }

    // ✅ CORRIGIDO: usar nomes corretos dos campos
    private ProcedimentoSadtDTO converterProcedimentoParaDTO(ProcedimentoSadt procedimento) {
        return ProcedimentoSadtDTO.builder()
                .id(procedimento.getId())
                .codigo(procedimento.getCodigoSigtap()) // ✅ CORRIGIDO: usar codigoSigtap
                .nome(procedimento.getNomeProcedimento()) // ✅ CORRIGIDO: usar nomeProcedimento
                .quantidade(procedimento.getQuantidade())
                .cid10(procedimento.getCid10())
                .justificativa(procedimento.getJustificativa())
                .preparo(procedimento.getPreparo())
                .valorSus(procedimento.getValorSus()) // ✅ ADICIONAR campo valorSus
                .autorizado(procedimento.getAutorizado()) // ✅ ADICIONAR campo autorizado
                .executado(procedimento.getExecutado()) // ✅ ADICIONAR campo executado
                .build();
    }
}
