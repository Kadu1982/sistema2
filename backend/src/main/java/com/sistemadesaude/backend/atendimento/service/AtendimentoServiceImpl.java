package com.sistemadesaude.backend.atendimento.service;

import com.sistemadesaude.backend.atendimento.dto.AtendimentoDTO;
import com.sistemadesaude.backend.atendimento.entity.Atendimento;
import com.sistemadesaude.backend.atendimento.mapper.AtendimentoMapper;
import com.sistemadesaude.backend.atendimento.repository.AtendimentoRepository;
import com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementação do serviço de Atendimento.
 */
@Service
@RequiredArgsConstructor
public class AtendimentoServiceImpl implements AtendimentoService {

    private final AtendimentoRepository repository;
    private final AtendimentoMapper mapper;

    @Override
    public AtendimentoDTO criarAtendimento(AtendimentoDTO dto) {
        Atendimento entity = mapper.toEntity(dto);
        if (entity.getDataHora() == null) {
            entity.setDataHora(LocalDateTime.now());
        }
        Atendimento salvo = repository.save(entity);
        return mapper.toDTO(salvo);
    }

    @Override
    public AtendimentoDTO buscarPorId(String id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com id " + id));
    }

    @Override
    public List<AtendimentoDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AtendimentoDTO> buscarPorPaciente(String pacienteId) {
        return repository.findByPacienteIdOrderByDataHoraDesc(pacienteId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AtendimentoDTO> buscarPorCid10(String cid10) {
        return repository.findByCid10OrderByDataHoraDesc(cid10)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AtendimentoDTO> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByDataHoraBetween(inicio, fim)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AtendimentoDTO> buscarPorDiagnostico(String diagnostico) {
        return repository.findByDiagnosticoContainingIgnoreCaseOrderByDataHoraDesc(diagnostico)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AtendimentoDTO atualizarAtendimento(String id, AtendimentoDTO dto) {
        Atendimento existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com id " + id));

        dto.setId(id);
        Atendimento entity = mapper.toEntity(dto);
        Atendimento atualizado = repository.save(entity);
        return mapper.toDTO(atualizado);
    }

    @Override
    public void excluirAtendimento(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Atendimento não encontrado com id " + id);
        }
        repository.deleteById(id);
    }
}