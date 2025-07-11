// src/main/java/com/sistemadesaude/backend/controller/CidController.java

package com.sistemadesaude.backend.verdepois;

import com.sistemadesaude.backend.verdepois.model.Cid;
import com.sistemadesaude.backend.verdepois.repository.CidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cids")
public class CidController {

    @Autowired
    private CidRepository cidRepository;

    @GetMapping
    public Map<String, Object> buscar(@RequestParam("busca") String busca) {
        List<Cid> resultados = cidRepository
                .findTop10ByCodigoContainingIgnoreCaseOrDescricaoContainingIgnoreCase(busca, busca);

        return Map.of(
                "success", true,
                "data", resultados
        );
    }
}
