package com.sistemadesaude.backend.operador.controller;

import com.sistemadesaude.backend.operador.dto.LoginRequest;
import com.sistemadesaude.backend.operador.dto.LoginResponse;
import com.sistemadesaude.backend.operador.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth") // ✅ CORRIGIDO: Removido o "/api" para corresponder ao SecurityConfig
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Delega toda a lógica para o serviço de autenticação
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}