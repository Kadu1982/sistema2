
package com.sistemadesaude.backend.recepcao.service;

import com.sistemadesaude.backend.recepcao.dto.AgendamentoDTO;
import com.sistemadesaude.backend.recepcao.dto.NovoAgendamentoRequest;
import com.sistemadesaude.backend.recepcao.entity.Agendamento;
import com.sistemadesaude.backend.recepcao.mapper.AgendamentoMapper;
import com.sistemadesaude.backend.recepcao.repository.AgendamentoRepository;
import com.sistemadesaude.backend.verdepois.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementação do serviço de Agendamento da Recepção.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgendamentoServiceImpl implements AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final AgendamentoMapper agendamentoMapper;

    @Override
    public AgendamentoDTO criarAgendamento(NovoAgendamentoRequest request) {
        log.info("🏥 AgendamentoService: Criando agendamento para paciente ID: {}", request.getPacienteId());

        try {
            Agendamento agendamento = new Agendamento();
            agendamento.setPacienteId(request.getPacienteId());
            agendamento.setTipoAtendimento(request.getTipo());
            agendamento.setDataHora(request.getDataHoraConvertida());
            agendamento.setStatus("AGENDADO");
            agendamento.setEspecialidade(request.getEspecialidade());
            agendamento.setPrioridade(request.getPrioridade());
            agendamento.setObservacoes(request.getObservacoes());
            agendamento.setUnidade(request.getUnidade());

            // Configurar exames selecionados
            if (request.getExamesSelecionados() != null && !request.getExamesSelecionados().isEmpty()) {
                agendamento.setExamesSelecionadosList(request.getExamesSelecionados());
            }

            Agendamento salvo = agendamentoRepository.save(agendamento);
            AgendamentoDTO resultado = agendamentoMapper.toDTO(salvo);

            log.info("✅ AgendamentoService: Agendamento criado com ID: {}", resultado.getId());
            return resultado;

        } catch (Exception e) {
            log.error("❌ Erro ao criar agendamento: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao criar agendamento: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AgendamentoDTO> listarPorData(LocalDate data) {
        log.info("📅 AgendamentoService: Buscando agendamentos para data: {}", data);

        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.atTime(LocalTime.MAX);

        List<Agendamento> agendamentos = agendamentoRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicio, fim);

        log.info("📊 AgendamentoService: {} agendamento(s) encontrado(s)", agendamentos.size());

        return agendamentos.stream()
                .map(agendamentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AgendamentoDTO buscarPorId(Long id) {
        log.info("🔍 AgendamentoService: Buscando agendamento ID: {}", id);

        return agendamentoRepository.findById(id)
                .map(agendamentoMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id " + id));
    }

    @Override
    public List<AgendamentoDTO> listarPorPaciente(Long pacienteId) {
        log.info("👤 AgendamentoService: Buscando agendamentos do paciente ID: {}", pacienteId);

        List<Agendamento> agendamentos = agendamentoRepository.findByPacienteIdOrderByDataHoraDesc(pacienteId);

        return agendamentos.stream()
                .map(agendamentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AgendamentoDTO atualizarStatus(Long id, String novoStatus) {
        log.info("🔄 AgendamentoService: Atualizando status do agendamento {} para: {}", id, novoStatus);

        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id " + id));

        agendamento.setStatus(novoStatus);
        Agendamento atualizado = agendamentoRepository.save(agendamento);

        return agendamentoMapper.toDTO(atualizado);
    }

    @Override
    public boolean precisaSadt(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id " + agendamentoId));

        String tipo = agendamento.getTipoAtendimento();

        // SADT é necessária para exames
        return tipo != null && (
                tipo.toLowerCase().contains("exame") ||
                        tipo.equals("exame_laboratorial") ||
                        tipo.equals("exame_imagem")
        );
    }

    @Override
    public List<AgendamentoDTO> listarTodos() {
        log.info("📋 AgendamentoService: Listando todos os agendamentos");

        return agendamentoRepository.findAll().stream()
                .map(agendamentoMapper::toDTO)
                .collect(Collectors.toList());
    }
}