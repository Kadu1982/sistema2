package com.sistemadesaude.backend.perfilacesso.service;

import com.sistemadesaude.backend.perfilacesso.dto.PerfilDTO;
import com.sistemadesaude.backend.perfilacesso.mapper.PerfilMapper; // Import correto
import com.sistemadesaude.backend.perfilacesso.entity.PerfilEntity;
import com.sistemadesaude.backend.perfilacesso.repository.PerfilRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Implementação do serviço de perfis de acesso
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PerfilServiceImpl implements PerfilService {

    private final PerfilRepository perfilRepository;
    private final PerfilMapper perfilMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PerfilDTO> listarTodos() {
        log.debug("Listando todos os perfis");
        return perfilMapper.toDTOList(perfilRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PerfilDTO> buscarPorId(Long id) {
        log.debug("Buscando perfil pelo ID: {}", id);
        return perfilRepository.findById(id)
                .map(perfilMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PerfilDTO> buscarPorNome(String nome) {
        log.debug("Buscando perfil pelo nome: {}", nome);
        return perfilRepository.findByNome(nome)
                .map(perfilMapper::toDTO);
    }

    @Override
    public PerfilDTO criar(PerfilDTO perfilDTO) throws IllegalArgumentException {
        log.debug("Criando perfil: {}", perfilDTO);

        // Verificar se já existe perfil com o mesmo tipo
        if (perfilDTO.getTipo() != null && perfilRepository.existsByTipo(perfilDTO.getTipo())) {
            throw new IllegalArgumentException("Já existe um perfil com o tipo: " + perfilDTO.getTipo());
        }

        // Verificar se já existe perfil com o mesmo nome customizado
        if (perfilDTO.getNomeCustomizado() != null &&
                perfilRepository.existsByNomeCustomizado(perfilDTO.getNomeCustomizado())) {
            throw new IllegalArgumentException("Já existe um perfil com o nome: " + perfilDTO.getNomeCustomizado());
        }

        // Obtém o usuário atual para auditoria
        String usuarioAtual = getUsuarioAtual();

        // Configura dados de auditoria
        if (perfilDTO.getCriadoPor() == null) {
            perfilDTO.setCriadoPor(usuarioAtual);
        }
        perfilDTO.setAtualizadoPor(usuarioAtual);

        // Converte para entidade e salva
        PerfilEntity perfil = perfilMapper.toEntity(perfilDTO);
        PerfilEntity perfilSalvo = perfilRepository.save(perfil);

        return perfilMapper.toDTO(perfilSalvo);
    }

    @Override
    public PerfilDTO atualizar(Long id, PerfilDTO perfilDTO) throws EntityNotFoundException, IllegalArgumentException {
        log.debug("Atualizando perfil com ID: {}", id);

        // Buscar perfil existente
        PerfilEntity perfilExistente = perfilRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado com o ID: " + id));

        // Verificar se é um perfil de sistema e está tentando alterar dados importantes
        if (Boolean.TRUE.equals(perfilExistente.getSistemaPerfil()) &&
                !Objects.equals(perfilExistente.getNomeCustomizado(), perfilDTO.getNomeCustomizado())) {
            throw new IllegalArgumentException("Não é permitido alterar o nome de um perfil de sistema");
        }

        // Verificar se já existe outro perfil com o mesmo nome customizado
        if (!Objects.equals(perfilExistente.getNomeCustomizado(), perfilDTO.getNomeCustomizado()) &&
                perfilDTO.getNomeCustomizado() != null &&
                perfilRepository.existsByNomeCustomizado(perfilDTO.getNomeCustomizado())) {
            throw new IllegalArgumentException("Já existe um perfil com o nome: " + perfilDTO.getNomeCustomizado());
        }

        // Obtém o usuário atual para auditoria
        String usuarioAtual = getUsuarioAtual();
        perfilDTO.setAtualizadoPor(usuarioAtual);

        // Atualiza a entidade com os dados do DTO
        perfilMapper.updateEntityFromDTO(perfilExistente, perfilDTO);

        // Salva as alterações
        PerfilEntity perfilAtualizado = perfilRepository.save(perfilExistente);

        return perfilMapper.toDTO(perfilAtualizado);
    }

    @Override
    public void excluir(Long id) throws EntityNotFoundException, IllegalStateException {
        log.debug("Excluindo perfil com ID: {}", id);

        // Buscar perfil existente
        PerfilEntity perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado com o ID: " + id));

        // Verificar se é um perfil de sistema
        if (Boolean.TRUE.equals(perfil.getSistemaPerfil())) {
            throw new IllegalStateException("Não é permitido excluir um perfil de sistema");
        }

        // Excluir perfil
        perfilRepository.delete(perfil);
    }

    @Override
    public PerfilDTO atribuirPermissoes(Long id, List<String> permissoes) throws EntityNotFoundException {
        log.debug("Atribuindo permissões ao perfil com ID: {}", id);

        // Buscar perfil existente
        PerfilEntity perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado com o ID: " + id));

        // Obtém o usuário atual para auditoria
        String usuarioAtual = getUsuarioAtual();
        perfil.setAtualizadoPor(usuarioAtual);

        // Atualiza as permissões (convertendo List para Set)
        perfil.setPermissoes(new HashSet<>(permissoes));

        // Salva as alterações
        PerfilEntity perfilAtualizado = perfilRepository.save(perfil);

        return perfilMapper.toDTO(perfilAtualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> listarPermissoes() {
        log.debug("Listando todas as permissões disponíveis");

        // Lista de todas as permissões disponíveis no sistema
        return Arrays.asList(
                "ADMIN_SISTEMA",
                "ADMIN_UNIDADE",
                "GERENCIAR_USUARIOS",
                "GERENCIAR_PERFIS",
                "GERENCIAR_CONFIGURACOES",
                "GERENCIAR_UNIDADES",
                "GERENCIAR_PACIENTES",
                "GERENCIAR_ATENDIMENTOS",
                "GERENCIAR_AGENDAMENTOS",
                "GERENCIAR_MEDICAMENTOS",
                "GERENCIAR_PROCEDIMENTOS",
                "GERENCIAR_EXAMES",
                "VISUALIZAR_RELATORIOS",
                "RECEPCAO_ATENDER",
                "MEDICO_ATENDER",
                "ENFERMAGEM_ATENDER",
                "FARMACIA_ATENDER",
                "ODONTO_ATENDER"
        );
    }

    /**
     * Obtém o usuário atual do contexto de segurança
     */
    private String getUsuarioAtual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "sistema";
    }
}