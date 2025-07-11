package com.sistemadesaude.backend.paciente.controller;

import com.sistemadesaude.backend.paciente.dto.PacienteDTO;
import com.sistemadesaude.backend.paciente.dto.PacienteListDTO;
import com.sistemadesaude.backend.paciente.service.PacienteService;
import com.sistemadesaude.backend.verdepois.exception.BusinessException;
import com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException;
import jakarta.validation.Valid; // ✅ ADICIONADO: Para validar o DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ✅ ADICIONADO: Import de segurança
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

/**
 * Controlador REST para operações relacionadas a pacientes.
 * As permissões de acesso são definidas em cada método.
 */
@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    /**
     * Cria um novo paciente.
     * Apenas usuários com perfil de RECEPCAO, ADMIN ou MASTER podem criar.
     */
    @PostMapping
    // ✅ ANOTAÇÃO ADICIONADA: Define quem pode criar um paciente.
    @PreAuthorize("hasAnyRole('RECEPCAO', 'ADMIN', 'MASTER', 'ADMINISTRADOR_SISTEMA')")
    public ResponseEntity<PacienteDTO> criarPaciente(@Valid @RequestBody PacienteDTO pacienteDTO) {
        try {
            PacienteDTO pacienteCriado = pacienteService.criarPaciente(pacienteDTO);
            return new ResponseEntity<>(pacienteCriado, HttpStatus.CREATED);
        } catch (BusinessException e) {
            // Idealmente, o DTO já teria as validações, mas mantemos por segurança.
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Busca um paciente pelo ID.
     * Qualquer usuário autenticado pode buscar um paciente por ID.
     */
    @GetMapping("/{id}")
    // ✅ ANOTAÇÃO ADICIONADA: Permite que qualquer usuário logado acesse.
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PacienteDTO> buscarPacientePorId(@PathVariable Long id) {
        try {
            PacienteDTO paciente = pacienteService.buscarPacientePorId(id);
            return ResponseEntity.ok(paciente);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Atualiza os dados de um paciente.
     * Apenas usuários com perfil de RECEPCAO, ADMIN ou MASTER podem atualizar.
     */
    @PutMapping("/{id}")
    // ✅ ANOTAÇÃO ADICIONADA: Define quem pode atualizar um paciente.
    @PreAuthorize("hasAnyRole('RECEPCAO', 'ADMIN', 'MASTER', 'ADMINISTRADOR_SISTEMA')")
    public ResponseEntity<PacienteDTO> atualizarPaciente(@PathVariable Long id, @Valid @RequestBody PacienteDTO pacienteDTO) {
        try {
            PacienteDTO pacienteAtualizado = pacienteService.atualizarPaciente(id, pacienteDTO);
            return ResponseEntity.ok(pacienteAtualizado);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Exclui um paciente pelo ID.
     * Apenas usuários com perfil de ADMIN ou MASTER podem excluir.
     */
    @DeleteMapping("/{id}")
    // ✅ ANOTAÇÃO ADICIONADA: Define quem pode excluir um paciente.
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER', 'ADMINISTRADOR_SISTEMA')")
    public ResponseEntity<Void> excluirPaciente(@PathVariable Long id) {
        try {
            pacienteService.excluirPaciente(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lista todos os pacientes (para listagens gerais).
     * Qualquer usuário autenticado pode listar.
     */
    @GetMapping
    // ✅ ANOTAÇÃO ADICIONADA: Permite que qualquer usuário logado acesse a lista.
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PacienteListDTO>> listarTodosPacientes() {
        List<PacienteListDTO> pacientes = pacienteService.listarTodosPacientes();
        return ResponseEntity.ok(pacientes);
    }

    /**
     * Endpoint de busca unificada.
     * Qualquer usuário autenticado pode realizar buscas.
     */
    @GetMapping("/buscar")
    // ✅ ANOTAÇÃO ADICIONADA: Permite que qualquer usuário logado realize buscas.
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PacienteListDTO>> buscarPacientes(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String cns) {

        // A lógica interna permanece a mesma, pois já é funcional.
        if (nome != null && !nome.trim().isEmpty()) {
            List<PacienteListDTO> pacientes = pacienteService.buscarPacientesPorNome(nome.trim());
            return ResponseEntity.ok(pacientes);
        }

        if (cpf != null && !cpf.trim().isEmpty()) {
            PacienteDTO paciente = pacienteService.buscarPorCpf(cpf.trim());
            return paciente != null
                    ? ResponseEntity.ok(Collections.singletonList(convertToListDTO(paciente)))
                    : ResponseEntity.ok(Collections.emptyList());
        }

        if (cns != null && !cns.trim().isEmpty()) {
            PacienteDTO paciente = pacienteService.buscarPorCns(cns.trim());
            return paciente != null
                    ? ResponseEntity.ok(Collections.singletonList(convertToListDTO(paciente)))
                    : ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.badRequest().body(Collections.emptyList());
    }

    // Os outros endpoints (buscar/cpf, buscar/cns, vulnerabilidade) podem seguir o mesmo padrão
    // de @PreAuthorize("isAuthenticated()") ou perfis mais específicos se necessário.

    private PacienteListDTO convertToListDTO(PacienteDTO paciente) {
        return PacienteListDTO.builder()
                .id(paciente.getId())
                .nomeCompleto(paciente.getNomeCompleto())
                .nomeSocial(paciente.getNomeSocial())
                .cpf(paciente.getCpf())
                .cns(paciente.getCns())
                .dataNascimento(paciente.getDataNascimento())
                .municipio(paciente.getMunicipio())
                .telefoneCelular(paciente.getTelefoneCelular())
                .build();
    }
}