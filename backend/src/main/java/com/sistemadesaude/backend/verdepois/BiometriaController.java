package com.sistemadesaude.backend.verdepois;

import com.sistemadesaude.backend.operador.entity.Operador;
import com.sistemadesaude.backend.operador.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/biometria")
@RequiredArgsConstructor
public class BiometriaController {

    private final OperadorRepository operadorRepository;

    @GetMapping("/verificar/{cpf}")
    public ResponseEntity<Operador> verificarPorCpf(@PathVariable String cpf) {
        Optional<Operador> operador = operadorRepository.findByCpf(cpf);

        return operador
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // O método e o endpoint abaixo foram removidos porque a busca por templateId
    // não é mais suportada na entidade Operador.
    //
    // @GetMapping("/verificar/template/{templateId}")
    // public ResponseEntity<Operador> verificarPorTemplateId(@PathVariable String templateId) {
    //     Optional<Operador> operador = operadorRepository.findByTemplateId(templateId);
    //     return operador
    //             .map(ResponseEntity::ok)
    //             .orElseGet(() -> ResponseEntity.notFound().build());
    // }

}