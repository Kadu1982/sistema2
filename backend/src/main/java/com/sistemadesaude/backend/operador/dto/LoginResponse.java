package com.sistemadesaude.backend.operador.dto;

public class LoginResponse {
    private String token;
    private OperadorDTO operador;

    // Construtores
    public LoginResponse() {}

    public LoginResponse(String token, OperadorDTO operador) {
        this.token = token;
        this.operador = operador;
    }

    // Getters e Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public OperadorDTO getOperador() {
        return operador;
    }

    public void setOperador(OperadorDTO operador) {
        this.operador = operador;
    }
}