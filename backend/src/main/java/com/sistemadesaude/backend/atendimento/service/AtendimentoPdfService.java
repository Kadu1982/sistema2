package com.sistemadesaude.backend.atendimento.service;

import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class AtendimentoPdfService {

    public byte[] gerarPdf(Atendimento atendimento) {
        try {
            Document doc = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            doc.add(new Paragraph("Atendimento Médico", titleFont));
            doc.add(new Paragraph(" "));

            doc.add(new Paragraph("Paciente ID: " + atendimento.getPacienteId()));
            doc.add(new Paragraph("CID: " + atendimento.getCid10()));
            doc.add(new Paragraph("Diagnóstico:"));
            doc.add(new Paragraph(atendimento.getDiagnostico()));
            doc.add(new Paragraph("Prescrição:"));
            doc.add(new Paragraph(atendimento.getPrescricao()));
            doc.add(new Paragraph("Data/Hora: " + atendimento.getDataHora().toString()));

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }
}
