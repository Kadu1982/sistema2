package com.sistemadesaude.backend.verdepois;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteController {

    @GetMapping("/api/test")
    public String test() {
        return "Backend está funcionando!";
    }
}
