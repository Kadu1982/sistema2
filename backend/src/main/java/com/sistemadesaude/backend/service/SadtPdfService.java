package com.sistemadesaude.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.sistemadesaude.backend.exames.dto.ProcedimentoSadtDTO;
import com.sistemadesaude.backend.verdepois.dto.SadtDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Serviço responsável pela geração de PDFs para SADTs.
 * 
 * IMPORTANTE: Este serviço é utilizado diretamente pelo frontend através do endpoint /api/sadt/gerar
 * e também pelo endpoint /agendamentos/{id}/sadt-pdf. Qualquer alteração no layout do PDF deve ser
 * feita neste arquivo.
 * 
 * O frontend possui um mecanismo de fallback para geração local de HTML em caso de falha na comunicação
 * com o backend, mas esse fallback foi desativado para garantir que as alterações de layout sejam
 * sempre aplicadas.
 */

@Service
@Slf4j
public class SadtPdfService {

    // ✅ Mapeamento dos códigos para nomes do frontend
    private static final Map<String, String> MAPA_EXAMES = new HashMap<>();
    static {
        MAPA_EXAMES.put("hemograma_completo", "Hemograma Completo");
        MAPA_EXAMES.put("glicemia_jejum", "Glicemia de Jejum");
        MAPA_EXAMES.put("colesterol_total", "Colesterol Total e Frações");
        MAPA_EXAMES.put("ureia_creatinina", "Ureia e Creatinina");
        MAPA_EXAMES.put("tsh", "TSH - Hormônio Tireoestimulante");
        MAPA_EXAMES.put("eas", "Exame de Urina (EAS)");
        MAPA_EXAMES.put("radiografia_torax", "Radiografia de Tórax");
        MAPA_EXAMES.put("ultrassom_abdominal", "Ultrassom Abdominal");
        MAPA_EXAMES.put("ecocardiograma", "Ecocardiograma");
        MAPA_EXAMES.put("mamografia", "Mamografia");
        MAPA_EXAMES.put("tomografia_cranio", "Tomografia de Crânio");
        MAPA_EXAMES.put("ressonancia_joelho", "Ressonância Magnética de Joelho");
    }

    public byte[] gerarPdf(SadtDTO sadtDto) {
        try {
            log.info("📋 Gerando PDF da SADT: {}", sadtDto.getNumeroSadt());

            // ✅ CONFIGURAÇÕES SUPER OTIMIZADAS PARA UMA ÚNICA PÁGINA
            Document document = new Document(PageSize.A4, 30, 30, 20, 20); // Margens ainda mais reduzidas
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();

            // ✅ FONTES AINDA MAIS REDIMENSIONADAS
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);     // Era 14
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BaseColor.BLACK);     // Era 10
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.BLACK);          // Era 9
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 7, BaseColor.GRAY);            // Era 8

            // ✅ LAYOUT SUPER COMPACTO PARA UMA ÚNICA PÁGINA
            adicionarCabecalhoCompacto(document, sadtDto, titleFont, headerFont, normalFont, smallFont);

            // Sem espaço entre seções
            adicionarDadosEstabelecimentoCompacto(document, sadtDto, headerFont, normalFont);

            // Espaço mínimo
            document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 3)));

            adicionarDadosPacienteCompacto(document, sadtDto, headerFont, normalFont);

            // Espaço mínimo
            document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 3)));

            adicionarDadosSolicitanteCompacto(document, sadtDto, headerFont, normalFont);

            // Espaço mínimo
            document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 3)));

            adicionarProcedimentosLista(document, sadtDto, headerFont, normalFont);

            if (sadtDto.getSolicitacao().getObservacoes() != null && !sadtDto.getSolicitacao().getObservacoes().trim().isEmpty()) {
                // Espaço mínimo
                document.add(new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 3)));
                adicionarObservacoesCompacto(document, sadtDto, headerFont, normalFont);
            }

            // ✅ RODAPÉ COM ASSINATURAS E OPERADOR RESPONSÁVEL
            adicionarRodapeCompacto(document, sadtDto, smallFont);

            document.close();

            log.info("✅ PDF da SADT gerado com sucesso em formato compacto de uma página");
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("❌ Erro ao gerar PDF da SADT: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao gerar PDF da SADT", e);
        }
    }

    // ✅ CABEÇALHO COMPACTO COM BRASÃO DA CIDADE E SADT Nº
    private void adicionarCabecalhoCompacto(Document document, SadtDTO sadtDto, Font titleFont, Font headerFont, Font normalFont, Font smallFont) throws DocumentException {
        // Tabela para o cabeçalho com brasão
        PdfPTable headerTable = new PdfPTable(3);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{0.2f, 0.6f, 0.2f});

        // Célula para possível brasão (espaço reservado)
        PdfPCell brasaoCell = new PdfPCell();
        brasaoCell.setBorder(Rectangle.NO_BORDER);
        brasaoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        brasaoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        // Aqui pode ser adicionado o brasão da cidade quando disponível
        // brasaoCell.addElement(Image.getInstance("caminho/para/brasao.png"));
        headerTable.addCell(brasaoCell);

        // Célula central com título
        PdfPCell tituloCell = new PdfPCell();
        tituloCell.setBorder(Rectangle.NO_BORDER);
        tituloCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        // Título principal compacto
        Paragraph titulo = new Paragraph("SOLICITAÇÃO DE AUXÍLIO DIAGNÓSTICO E TERAPIA", titleFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingAfter(2);
        tituloCell.addElement(titulo);

        // Adicionar município se disponível
        if (sadtDto.getEstabelecimento().getMunicipio() != null && !sadtDto.getEstabelecimento().getMunicipio().isEmpty()) {
            Paragraph municipio = new Paragraph("Município: " + sadtDto.getEstabelecimento().getMunicipio(), smallFont);
            municipio.setAlignment(Element.ALIGN_CENTER);
            tituloCell.addElement(municipio);
        }

        headerTable.addCell(tituloCell);

        // Célula direita com número SADT
        PdfPCell infoCell = new PdfPCell();
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        infoCell.addElement(new Paragraph("SADT Nº: " + sadtDto.getNumeroSadt(), headerFont));
        infoCell.addElement(new Paragraph("Data: " + 
                sadtDto.getSolicitacao().getDataEmissao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), normalFont));

        if (sadtDto.getSolicitacao().getUrgente()) {
            Paragraph urgente = new Paragraph("🚨 URGENTE",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.RED));
            urgente.setAlignment(Element.ALIGN_RIGHT);
            infoCell.addElement(urgente);
        }

        headerTable.addCell(infoCell);
        document.add(headerTable);

        // Informação do tipo de SADT
        Paragraph tipoSadt = new Paragraph("Tipo: " + formatarTipoSadt(sadtDto.getSolicitacao().getTipoSadt()), normalFont);
        tipoSadt.setAlignment(Element.ALIGN_CENTER);
        document.add(tipoSadt);

        // Linha separadora
        document.add(new Paragraph("_____________________________________________________________________", smallFont));
    }

    // ✅ DADOS DO ESTABELECIMENTO SUPER COMPACTOS
    private void adicionarDadosEstabelecimentoCompacto(Document document, SadtDTO sadtDto, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph secao = new Paragraph("IDENTIFICAÇÃO DO DOCUMENTO", headerFont);
        secao.setSpacingAfter(2);
        document.add(secao);

        // Tabela com 4 colunas para maior compactação
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.25f, 0.25f, 0.25f, 0.25f});
        table.setSpacingAfter(2);

        // Primeira linha
        PdfPCell nomeLabel = new PdfPCell(new Phrase("Estabelecimento:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
        nomeLabel.setBorder(Rectangle.NO_BORDER);
        nomeLabel.setPadding(1);
        table.addCell(nomeLabel);

        PdfPCell nomeValue = new PdfPCell(new Phrase(sadtDto.getEstabelecimento().getNome() != null ? sadtDto.getEstabelecimento().getNome() : "", 
                FontFactory.getFont(FontFactory.HELVETICA, 8)));
        nomeValue.setBorder(Rectangle.NO_BORDER);
        nomeValue.setPadding(1);
        nomeValue.setColspan(3);
        table.addCell(nomeValue);

        // Segunda linha
        PdfPCell cnesLabel = new PdfPCell(new Phrase("CNES:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
        cnesLabel.setBorder(Rectangle.NO_BORDER);
        cnesLabel.setPadding(1);
        table.addCell(cnesLabel);

        PdfPCell cnesValue = new PdfPCell(new Phrase(sadtDto.getEstabelecimento().getCnes() != null ? sadtDto.getEstabelecimento().getCnes() : "", 
                FontFactory.getFont(FontFactory.HELVETICA, 8)));
        cnesValue.setBorder(Rectangle.NO_BORDER);
        cnesValue.setPadding(1);
        table.addCell(cnesValue);

        PdfPCell telefoneLabel = new PdfPCell(new Phrase("Telefone:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
        telefoneLabel.setBorder(Rectangle.NO_BORDER);
        telefoneLabel.setPadding(1);
        table.addCell(telefoneLabel);

        PdfPCell telefoneValue = new PdfPCell(new Phrase(sadtDto.getEstabelecimento().getTelefone() != null ? sadtDto.getEstabelecimento().getTelefone() : "", 
                FontFactory.getFont(FontFactory.HELVETICA, 8)));
        telefoneValue.setBorder(Rectangle.NO_BORDER);
        telefoneValue.setPadding(1);
        table.addCell(telefoneValue);

        document.add(table);
    }

    // ✅ DADOS DO PACIENTE EM UMA LINHA
    private void adicionarDadosPacienteCompacto(Document document, SadtDTO sadtDto, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph secao = new Paragraph("DADOS DO PACIENTE", headerFont);
        secao.setSpacingAfter(3);
        document.add(secao);

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);

        // ✅ NOME E ID EM UMA ÚNICA LINHA
        String pacienteCompleto = String.format("ID: %d - %s",
                sadtDto.getPaciente().getId(),
                sadtDto.getPaciente().getNome());
        adicionarCelulaSimples(table, "Paciente:", pacienteCompleto, normalFont);

        if (sadtDto.getPaciente().getCpf() != null) {
            adicionarCelulaSimples(table, "CPF:", sadtDto.getPaciente().getCpf(), normalFont);
        }

        if (sadtDto.getPaciente().getDataNascimento() != null) {
            adicionarCelulaSimples(table, "Nascimento:", sadtDto.getPaciente().getDataNascimento(), normalFont);
        }

        document.add(table);
    }

    // ✅ DADOS DO SOLICITANTE COMPACTOS (SEM ESPECIALIDADE)
    private void adicionarDadosSolicitanteCompacto(Document document, SadtDTO sadtDto, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph secao = new Paragraph("DADOS DO SOLICITANTE", headerFont);
        secao.setSpacingAfter(3);
        document.add(secao);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 1f});

        adicionarCelulaCompacta(table, "Profissional:", sadtDto.getSolicitante().getNome(), normalFont);
        adicionarCelulaCompacta(table, "Conselho:",
                sadtDto.getSolicitante().getConselho() + " " + sadtDto.getSolicitante().getNumeroConselho(), normalFont);

        document.add(table);
    }

    // ✅ PROCEDIMENTOS EM FORMATO LISTA COMPACTA SEM VALORES
    private void adicionarProcedimentosLista(Document document, SadtDTO sadtDto, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph secao = new Paragraph("PROCEDIMENTOS SOLICITADOS", headerFont);
        secao.setSpacingAfter(2);
        document.add(secao);

        // Usar tabela para layout mais compacto e organizado
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.2f, 0.8f});
        table.setSpacingAfter(0);

        // ✅ CORRIGIDO: usar getSolicitacao().getProcedimentos()
        for (ProcedimentoSadtDTO procedimento : sadtDto.getSolicitacao().getProcedimentos()) {
            // Célula para o código
            PdfPCell codigoCell = new PdfPCell(new Phrase(procedimento.getCodigo(), 
                    FontFactory.getFont(FontFactory.HELVETICA, 7)));
            codigoCell.setBorder(Rectangle.NO_BORDER);
            codigoCell.setPadding(1);
            table.addCell(codigoCell);

            // Célula para o nome do exame (sem valores)
            String nomeFormatado = obterNomeExameFormatado(procedimento.getCodigo(), procedimento.getNome());

            // Adicionar quantidade se for maior que 1
            if (procedimento.getQuantidade() > 1) {
                nomeFormatado += " (Qtd: " + procedimento.getQuantidade() + ")";
            }

            PdfPCell nomeCell = new PdfPCell(new Phrase(nomeFormatado, 
                    FontFactory.getFont(FontFactory.HELVETICA, 7)));
            nomeCell.setBorder(Rectangle.NO_BORDER);
            nomeCell.setPadding(1);
            table.addCell(nomeCell);
        }

        document.add(table);
    }

    // ✅ OBSERVAÇÕES SUPER COMPACTAS
    private void adicionarObservacoesCompacto(Document document, SadtDTO sadtDto, Font headerFont, Font normalFont) throws DocumentException {
        Paragraph secao = new Paragraph("OBSERVAÇÕES", headerFont);
        secao.setSpacingAfter(1);
        document.add(secao);

        // Usar fonte menor para observações
        Font obsFont = FontFactory.getFont(FontFactory.HELVETICA, 7);
        Paragraph observacoes = new Paragraph(sadtDto.getSolicitacao().getObservacoes(), obsFont);
        observacoes.setIndentationLeft(5);
        observacoes.setAlignment(Element.ALIGN_JUSTIFIED);
        document.add(observacoes);
    }

    // ✅ RODAPÉ COM ASSINATURAS E OPERADOR RESPONSÁVEL
    private void adicionarRodapeCompacto(Document document, SadtDTO sadtDto, Font smallFont) throws DocumentException {
        // Espaço reduzido para assinaturas
        document.add(new Paragraph("\n"));

        // Tabela para assinaturas (médico solicitante e operador responsável)
        PdfPTable assinaturasTable = new PdfPTable(2);
        assinaturasTable.setWidthPercentage(100);
        assinaturasTable.setWidths(new float[]{1f, 1f});

        // Assinatura do médico solicitante
        PdfPCell assinaturaMedicoCell = new PdfPCell();
        assinaturaMedicoCell.setBorder(Rectangle.TOP);
        assinaturaMedicoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        assinaturaMedicoCell.setPadding(2);

        Paragraph medicoNome = new Paragraph(sadtDto.getSolicitante().getNome(), 
                FontFactory.getFont(FontFactory.HELVETICA, 7));
        medicoNome.setAlignment(Element.ALIGN_CENTER);
        assinaturaMedicoCell.addElement(medicoNome);

        Paragraph medicoLabel = new Paragraph("Médico Solicitante", 
                FontFactory.getFont(FontFactory.HELVETICA, 7, BaseColor.GRAY));
        medicoLabel.setAlignment(Element.ALIGN_CENTER);
        assinaturaMedicoCell.addElement(medicoLabel);

        assinaturasTable.addCell(assinaturaMedicoCell);

        // Operador responsável pela autorização
        PdfPCell operadorCell = new PdfPCell();
        operadorCell.setBorder(Rectangle.TOP);
        operadorCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        operadorCell.setPadding(2);

        Paragraph operadorNome = new Paragraph(sadtDto.getCriadoPor() != null ? sadtDto.getCriadoPor() : "Operador do Sistema", 
                FontFactory.getFont(FontFactory.HELVETICA, 7));
        operadorNome.setAlignment(Element.ALIGN_CENTER);
        operadorCell.addElement(operadorNome);

        Paragraph operadorLabel = new Paragraph("Responsável pela Autorização", 
                FontFactory.getFont(FontFactory.HELVETICA, 7, BaseColor.GRAY));
        operadorLabel.setAlignment(Element.ALIGN_CENTER);
        operadorCell.addElement(operadorLabel);

        assinaturasTable.addCell(operadorCell);

        document.add(assinaturasTable);

        // Rodapé com informações do sistema
        document.add(new Paragraph("\n", FontFactory.getFont(FontFactory.HELVETICA, 5)));

        PdfPTable rodapeTable = new PdfPTable(2);
        rodapeTable.setWidthPercentage(100);
        rodapeTable.setWidths(new float[]{1f, 1f});

        PdfPCell leftFooter = new PdfPCell();
        leftFooter.setBorder(Rectangle.NO_BORDER);
        leftFooter.setVerticalAlignment(Element.ALIGN_BOTTOM);

        String tipoImpressao = isReimpressao(sadtDto) ? "🖨️ REIMPRESSÃO" : "📋 IMPRESSÃO ORIGINAL";
        Paragraph tipoDoc = new Paragraph(tipoImpressao,
                FontFactory.getFont(FontFactory.HELVETICA, 6, BaseColor.GRAY));
        leftFooter.addElement(tipoDoc);

        PdfPCell rightFooter = new PdfPCell();
        rightFooter.setBorder(Rectangle.NO_BORDER);
        rightFooter.setHorizontalAlignment(Element.ALIGN_RIGHT);
        rightFooter.setVerticalAlignment(Element.ALIGN_BOTTOM);

        Paragraph sistema = new Paragraph("Sistema de Saúde Digital v2.0", 
                FontFactory.getFont(FontFactory.HELVETICA, 6, BaseColor.GRAY));
        sistema.setAlignment(Element.ALIGN_RIGHT);
        rightFooter.addElement(sistema);

        rodapeTable.addCell(leftFooter);
        rodapeTable.addCell(rightFooter);
        document.add(rodapeTable);
    }

    // ✅ MÉTODOS AUXILIARES

    private void adicionarCelulaCompacta(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(2);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "", font));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(2);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void adicionarCelulaSimples(PdfPTable table, String label, String value, Font font) {
        String conteudo = label + " " + (value != null ? value : "");
        PdfPCell cell = new PdfPCell(new Phrase(conteudo, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(3);
        table.addCell(cell);
    }

    // ✅ OBTER NOME FORMATADO DO EXAME (IGUAL AO FRONTEND) - CORRIGIDO PARÂMETRO
    private String obterNomeExameFormatado(String codigo, String nomeFallback) {
        // Primeiro tenta pelo mapeamento do frontend
        String nomeFormatado = MAPA_EXAMES.get(codigo);

        if (nomeFormatado != null) {
            return nomeFormatado;
        }

        // Se não encontrar, usa o nome do banco (era getDescricao)
        if (nomeFallback != null && !nomeFallback.trim().isEmpty()) {
            return nomeFallback;
        }

        // Fallback: formatar o código
        return codigo.replace("_", " ").toUpperCase();
    }

    private String formatarTipoSadt(String tipo) {
        switch (tipo.toLowerCase()) {
            case "laboratorial":
                return "Laboratorial";
            case "imagem":
                return "Exame de Imagem";
            case "terapeutico":
                return "Terapêutico";
            default:
                return tipo;
        }
    }

    // ✅ CORRIGIDO: usar campos que existem no DTO
    private boolean isReimpressao(SadtDTO sadtDto) {
        // Lógica simples para detectar se é reimpressão
        // Por exemplo, verificar se já passou tempo desde a criação

        if (sadtDto.getCriadoEm() != null) {
            // Se foi criada há mais de 2 minutos, considera reimpressão
            return sadtDto.getCriadoEm().isBefore(
                    java.time.LocalDateTime.now().minusMinutes(2)
            );
        }

        // Fallback: sempre considera primeira impressão se não tem dados
        return false;
    }
}
