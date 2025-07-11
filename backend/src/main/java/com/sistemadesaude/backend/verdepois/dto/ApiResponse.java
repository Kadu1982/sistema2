package com.sistemadesaude.backend.verdepois.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Classe para padronizar as respostas da API
 * @param <T> Tipo de dado retornado
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    /**
     * Indica se a operação foi bem-sucedida
     */
    private boolean success;
    
    /**
     * Mensagem descritiva sobre o resultado da operação
     */
    private String message;
    
    /**
     * Dados retornados pela operação
     */
    private T data;
    
    /**
     * Construtor para respostas de sucesso sem dados
     * @param message Mensagem de sucesso
     */
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }
    
    /**
     * Método estático para criar uma resposta de sucesso
     * @param message Mensagem de sucesso
     * @param data Dados a serem retornados
     * @return Objeto ApiResponse com status de sucesso
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    /**
     * Método estático para criar uma resposta de sucesso sem dados
     * @param message Mensagem de sucesso
     * @return Objeto ApiResponse com status de sucesso
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
    
    /**
     * Método estático para criar uma resposta de erro
     * @param message Mensagem de erro
     * @return Objeto ApiResponse com status de erro
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    /**
     * Método estático para criar uma resposta de erro com dados
     * @param message Mensagem de erro
     * @param data Dados adicionais sobre o erro
     * @return Objeto ApiResponse com status de erro
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }
}