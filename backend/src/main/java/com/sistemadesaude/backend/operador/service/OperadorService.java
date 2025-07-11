package com.sistemadesaude.backend.operador.service;

import com.sistemadesaude.backend.operador.dto.OperadorDTO;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

/**
 * Interface de serviço para gerenciamento de operadores do sistema
 */
public interface OperadorService {

    /**
     * Lista todos os operadores
     * @return Lista de operadores
     */
    List<OperadorDTO> listarTodos();

    /**
     * Busca um operador pelo ID
     * @param id ID do operador
     * @return Operador encontrado ou vazio
     */
    Optional<OperadorDTO> buscarPorId(Long id);

    /**
     * Busca um operador pelo login
     * @param login Login do operador
     * @return Operador encontrado ou vazio
     */
    Optional<OperadorDTO> buscarPorLogin(String login);

    /**
     * Cria um novo operador
     * @param operadorDTO Dados do operador
     * @return Operador criado
     * @throws IllegalArgumentException Se o login já existir
     */
    OperadorDTO criar(OperadorDTO operadorDTO) throws IllegalArgumentException;

    /**
     * Atualiza um operador existente
     * @param id ID do operador
     * @param operadorDTO Novos dados do operador
     * @return Operador atualizado
     * @throws EntityNotFoundException Se o operador não for encontrado
     * @throws IllegalArgumentException Se o login já existir para outro operador
     */
    OperadorDTO atualizar(Long id, OperadorDTO operadorDTO) throws EntityNotFoundException, IllegalArgumentException;

    /**
     * Exclui um operador
     * @param id ID do operador
     * @throws EntityNotFoundException Se o operador não for encontrado
     * @throws IllegalStateException Se o operador não puder ser excluído
     */
    void excluir(Long id) throws EntityNotFoundException, IllegalStateException;

    /**
     * Altera a senha de um operador
     * @param id ID do operador
     * @param novaSenha Nova senha
     * @throws EntityNotFoundException Se o operador não for encontrado
     */
    void alterarSenha(Long id, String novaSenha) throws EntityNotFoundException;

    /**
     * Ativa ou desativa um operador
     * @param id ID do operador
     * @param ativo Indica se o operador deve ficar ativo ou inativo
     * @return Operador atualizado
     * @throws EntityNotFoundException Se o operador não for encontrado
     * @throws IllegalStateException Se o operador for o admin.master e estiver tentando desativá-lo
     */
    OperadorDTO alterarStatus(Long id, boolean ativo) throws EntityNotFoundException, IllegalStateException;

    /**
     * Atribui perfis a um operador
     * @param id ID do operador
     * @param perfis Lista de perfis
     * @return Operador atualizado
     * @throws EntityNotFoundException Se o operador não for encontrado
     */
    OperadorDTO atribuirPerfis(Long id, List<String> perfis) throws EntityNotFoundException;

    /**
     * Lista todos os perfis disponíveis no sistema
     * @return Lista de perfis
     */
    List<String> listarPerfis();
}