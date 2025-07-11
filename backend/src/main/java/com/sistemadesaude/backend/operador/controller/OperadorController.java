package com.sistemadesaude.backend.operador.controller;

import com.sistemadesaude.backend.verdepois.dto.ApiResponse;
import com.sistemadesaude.backend.operador.dto.OperadorDTO;
import com.sistemadesaude.backend.operador.service.OperadorService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de operadores do sistema
 * Apenas usuários com perfil ADMINISTRADOR_SISTEMA ou admin.master podem acessar
 */
@RestController
@RequestMapping("/api/operadores")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMINISTRADOR_SISTEMA')")
public class OperadorController {

    private final OperadorService operadorService;

    /**
     * Lista todos os operadores
     * @return Lista de operadores
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OperadorDTO>>> listarTodos() {
        log.info("Requisição para listar todos os operadores");
        List<OperadorDTO> operadores = operadorService.listarTodos();
        return ResponseEntity.ok(new ApiResponse<>(true, "Operadores listados com sucesso", operadores));
    }

    /**
     * Busca um operador pelo ID
     * @param id ID do operador
     * @return Operador encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OperadorDTO>> buscarPorId(@PathVariable Long id) {
        log.info("Requisição para buscar operador pelo ID: {}", id);
        return operadorService.buscarPorId(id)
                .map(operador -> ResponseEntity.ok(new ApiResponse<>(true, "Operador encontrado com sucesso", operador)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Operador não encontrado com o ID: " + id, null)));
    }

    /**
     * Busca um operador pelo login
     * @param login Login do operador
     * @return Operador encontrado
     */
    @GetMapping("/login/{login}")
    public ResponseEntity<ApiResponse<OperadorDTO>> buscarPorLogin(@PathVariable String login) {
        log.info("Requisição para buscar operador pelo login: {}", login);
        return operadorService.buscarPorLogin(login)
                .map(operador -> ResponseEntity.ok(new ApiResponse<>(true, "Operador encontrado com sucesso", operador)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Operador não encontrado com o login: " + login, null)));
    }

    /**
     * Cria um novo operador
     * @param operadorDTO Dados do operador
     * @return Operador criado
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OperadorDTO>> criar(@Valid @RequestBody OperadorDTO operadorDTO) {
        log.info("Requisição para criar operador: {}", operadorDTO.getLogin());
        try {
            OperadorDTO operadorCriado = operadorService.criar(operadorDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Operador criado com sucesso", operadorCriado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Atualiza um operador existente
     * @param id ID do operador
     * @param operadorDTO Novos dados do operador
     * @return Operador atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OperadorDTO>> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OperadorDTO operadorDTO) {
        log.info("Requisição para atualizar operador com ID: {}", id);
        try {
            OperadorDTO operadorAtualizado = operadorService.atualizar(id, operadorDTO);
            return ResponseEntity.ok(new ApiResponse<>(true, "Operador atualizado com sucesso", operadorAtualizado));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Exclui um operador
     * @param id ID do operador
     * @return Resposta de sucesso ou erro
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> excluir(@PathVariable Long id) {
        log.info("Requisição para excluir operador com ID: {}", id);
        try {
            operadorService.excluir(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Operador excluído com sucesso", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Altera a senha de um operador
     * @param id ID do operador
     * @param senhaRequest Objeto com a nova senha
     * @return Resposta de sucesso ou erro
     */
    @PatchMapping("/{id}/senha")
    public ResponseEntity<ApiResponse<Void>> alterarSenha(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSenhaRequest senhaRequest) {
        log.info("Requisição para alterar senha do operador com ID: {}", id);
        try {
            operadorService.alterarSenha(id, senhaRequest.getNovaSenha());
            return ResponseEntity.ok(new ApiResponse<>(true, "Senha alterada com sucesso", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Ativa ou desativa um operador
     * @param id ID do operador
     * @param ativo Indica se o operador deve ficar ativo ou inativo
     * @return Operador atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OperadorDTO>> alterarStatus(
            @PathVariable Long id,
            @RequestParam boolean ativo) {
        log.info("Requisição para {} operador com ID: {}", ativo ? "ativar" : "desativar", id);
        try {
            OperadorDTO operadorAtualizado = operadorService.alterarStatus(id, ativo);
            String mensagem = ativo ? "Operador ativado com sucesso" : "Operador desativado com sucesso";
            return ResponseEntity.ok(new ApiResponse<>(true, mensagem, operadorAtualizado));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * Classe interna para receber requisições de alteração de senha
     */
    private static class AlterarSenhaRequest {
        private String novaSenha;

        public String getNovaSenha() {
            return novaSenha;
        }

        public void setNovaSenha(String novaSenha) {
            this.novaSenha = novaSenha;
        }
    }
}