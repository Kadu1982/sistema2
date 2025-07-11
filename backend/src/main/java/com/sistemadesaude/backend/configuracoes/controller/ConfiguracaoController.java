package com.sistemadesaude.backend.configuracoes.controller;

import com.sistemadesaude.backend.verdepois.dto.ApiResponse;
import com.sistemadesaude.backend.configuracoes.dto.ConfiguracaoDTO;
import com.sistemadesaude.backend.configuracoes.service.ConfiguracaoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller para gerenciamento de configurações do sistema
 * Apenas usuários com perfil ADMINISTRADOR_SISTEMA ou admin.master podem acessar
 */
@RestController
@RequestMapping("/api/configuracoes")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMINISTRADOR_SISTEMA')")
public class ConfiguracaoController {

    private final ConfiguracaoService configuracaoService;

    /**
     * Lista todas as configurações
     * @return Lista de configurações
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConfiguracaoDTO>>> listarTodas() {
        log.info("Requisição para listar todas as configurações");
        List<ConfiguracaoDTO> configuracoes = configuracaoService.listarTodas();
        return ResponseEntity.ok(new ApiResponse<>(true, "Configurações listadas com sucesso", configuracoes));
    }

    /**
     * Lista configurações por grupo
     * @param grupo Grupo de configurações
     * @return Lista de configurações do grupo
     */
    @GetMapping("/grupo/{grupo}")
    public ResponseEntity<ApiResponse<List<ConfiguracaoDTO>>> listarPorGrupo(@PathVariable String grupo) {
        log.info("Requisição para listar configurações do grupo: {}", grupo);
        List<ConfiguracaoDTO> configuracoes = configuracaoService.listarPorGrupo(grupo);
        return ResponseEntity.ok(new ApiResponse<>(true, "Configurações do grupo listadas com sucesso", configuracoes));
    }

    /**
     * Busca configurações por grupo como mapa
     * @param grupo Grupo de configurações
     * @return Mapa de configurações
     */
    @GetMapping("/grupo/{grupo}/mapa")
    public ResponseEntity<ApiResponse<Map<String, String>>> buscarMapaPorGrupo(@PathVariable String grupo) {
        log.info("Requisição para buscar mapa de configurações do grupo: {}", grupo);
        Map<String, String> mapa = configuracaoService.buscarMapaPorGrupo(grupo);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mapa de configurações obtido com sucesso", mapa));
    }

    /**
     * Busca uma configuração pela chave
     * @param chave Chave da configuração
     * @return Configuração encontrada
     */
    @GetMapping("/{chave}")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> buscarPorChave(@PathVariable String chave) {
        log.info("Requisição para buscar configuração pela chave: {}", chave);
        return configuracaoService.buscarPorChave(chave)
                .map(configuracao -> ResponseEntity.ok(new ApiResponse<>(true, "Configuração encontrada com sucesso", configuracao)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Configuração não encontrada com a chave: " + chave, null)));
    }

    /**
     * Salva uma configuração
     * @param configuracaoDTO Dados da configuração
     * @return Configuração salva
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> salvar(@Valid @RequestBody ConfiguracaoDTO configuracaoDTO) {
        log.info("Requisição para salvar configuração: {}", configuracaoDTO);
        ConfiguracaoDTO configuracaoSalva = configuracaoService.salvar(configuracaoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Configuração salva com sucesso", configuracaoSalva));
    }

    /**
     * Salva múltiplas configurações
     * @param configuracoes Lista de configurações
     * @return Lista de configurações salvas
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<ConfiguracaoDTO>>> salvarTodas(@Valid @RequestBody List<ConfiguracaoDTO> configuracoes) {
        log.info("Requisição para salvar {} configurações", configuracoes.size());
        List<ConfiguracaoDTO> configuracoesSalvas = configuracaoService.salvarTodas(configuracoes);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Configurações salvas com sucesso", configuracoesSalvas));
    }

    /**
     * Atualiza uma configuração
     * @param chave Chave da configuração
     * @param configuracaoDTO Novos dados da configuração
     * @return Configuração atualizada
     */
    @PutMapping("/{chave}")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> atualizar(
            @PathVariable String chave,
            @Valid @RequestBody ConfiguracaoDTO configuracaoDTO) {
        log.info("Requisição para atualizar configuração com chave: {}", chave);
        try {
            ConfiguracaoDTO configuracaoAtualizada = configuracaoService.atualizar(chave, configuracaoDTO);
            return ResponseEntity.ok(new ApiResponse<>(true, "Configuração atualizada com sucesso", configuracaoAtualizada));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Exclui uma configuração
     * @param chave Chave da configuração
     * @return Resposta de sucesso ou erro
     */
    @DeleteMapping("/{chave}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable String chave) {
        log.info("Requisição para excluir configuração com chave: {}", chave);
        try {
            configuracaoService.excluir(chave);
            return ResponseEntity.ok(new ApiResponse<>(true, "Configuração excluída com sucesso", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}