package com.sistemadesaude.backend.verdepois;

import com.sistemadesaude.backend.service.MonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador para endpoints de monitoramento da aplicação.
 * Fornece acesso a métricas de desempenho, saúde e estatísticas de uso.
 * Endpoints restritos a usuários com perfil de administrador.
 */
@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    // Serviço de monitoramento que coleta e fornece as métricas
    private final MonitoringService monitoringService;

    /**
     * Construtor com injeção de dependência do serviço de monitoramento.
     * 
     * @param monitoringService Serviço de monitoramento
     */
    @Autowired
    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    /**
     * Endpoint para verificar a saúde da aplicação.
     * Fornece informações sobre o status geral, tempo de atividade e uso de recursos.
     * 
     * @return Status de saúde da aplicação
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        // Registra a requisição no serviço de monitoramento
        monitoringService.registerRequest("/api/monitoring/health");
        
        // Marca o tempo de início para calcular o tempo de resposta
        long startTime = System.currentTimeMillis();
        
        try {
            // Obtém o status de saúde da aplicação
            Map<String, Object> healthStatus = monitoringService.getHealthStatus();
            
            // Calcula e registra o tempo de resposta
            long responseTime = System.currentTimeMillis() - startTime;
            monitoringService.registerResponseTime("/api/monitoring/health", responseTime);
            
            // Retorna o status de saúde
            return ResponseEntity.ok(healthStatus);
        } catch (Exception e) {
            // Registra o erro no serviço de monitoramento
            monitoringService.registerError("/api/monitoring/health");
            throw e;
        }
    }

    /**
     * Endpoint para obter métricas do sistema.
     * Fornece informações detalhadas sobre memória, sistema operacional e runtime.
     * Restrito a usuários com perfil de administrador.
     * 
     * @return Métricas do sistema
     */
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        // Registra a requisição no serviço de monitoramento
        monitoringService.registerRequest("/api/monitoring/metrics");
        
        // Marca o tempo de início para calcular o tempo de resposta
        long startTime = System.currentTimeMillis();
        
        try {
            // Obtém as métricas do sistema
            Map<String, Object> metrics = monitoringService.getSystemMetrics();
            
            // Calcula e registra o tempo de resposta
            long responseTime = System.currentTimeMillis() - startTime;
            monitoringService.registerResponseTime("/api/monitoring/metrics", responseTime);
            
            // Retorna as métricas
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            // Registra o erro no serviço de monitoramento
            monitoringService.registerError("/api/monitoring/metrics");
            throw e;
        }
    }

    /**
     * Endpoint para obter estatísticas de uso da aplicação.
     * Fornece informações sobre requisições, tempos de resposta e erros por endpoint.
     * Restrito a usuários com perfil de administrador.
     * 
     * @return Estatísticas de uso da aplicação
     */
    @GetMapping("/usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUsageStatistics() {
        // Registra a requisição no serviço de monitoramento
        monitoringService.registerRequest("/api/monitoring/usage");
        
        // Marca o tempo de início para calcular o tempo de resposta
        long startTime = System.currentTimeMillis();
        
        try {
            // Obtém as estatísticas de uso
            Map<String, Object> usageStats = monitoringService.getUsageStatistics();
            
            // Calcula e registra o tempo de resposta
            long responseTime = System.currentTimeMillis() - startTime;
            monitoringService.registerResponseTime("/api/monitoring/usage", responseTime);
            
            // Retorna as estatísticas
            return ResponseEntity.ok(usageStats);
        } catch (Exception e) {
            // Registra o erro no serviço de monitoramento
            monitoringService.registerError("/api/monitoring/usage");
            throw e;
        }
    }
}