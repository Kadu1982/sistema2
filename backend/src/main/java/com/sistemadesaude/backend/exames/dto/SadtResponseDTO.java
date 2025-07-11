package com.sistemadesaude.backend.exames.dto;

import com.sistemadesaude.backend.verdepois.dto.SadtDTO;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SadtResponseDTO {
    private String numeroSadt;
    private String pdfBase64;
    private SadtDTO sadtData;
}