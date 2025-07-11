package com.sistemadesaude.backend.service;

import com.sistemadesaude.backend.verdepois.model.Biometria;
import com.sistemadesaude.backend.verdepois.repository.BiometriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BiometriaService {

    @Autowired
    private BiometriaRepository biometriaRepository;

    public List<Biometria> listarPorOperador(Long operadorId) {
        return biometriaRepository.findByOperadorIdOrderByDataCapturaDesc(operadorId);
    }

    public Biometria buscarPorId(Long id) {
        return biometriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Biometria não encontrada"));
    }

}
