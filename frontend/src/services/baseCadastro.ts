/**
 * Reexporta os tipos essenciais para que outros módulos possam
 * importá-los diretamente a partir do serviço de cadastro.
 */
export type {
  Paciente,
  Profissional,
  UnidadeSaude,
  Agenda,
  SlotHorario,
} from '@/types/Paciente';

import {
  Paciente,
  Profissional,
  UnidadeSaude,
  Agenda,
  SlotHorario,
} from '@/types/Paciente';

/**
 * Define a estrutura para as configurações globais do sistema de recepcao.
 */
export interface ConfiguracoesAgenda {
  antecedenciaMinimaDias: number;
  antecedenciaMaximaDias: number;
  enviarLembrete24h: boolean;
  enviarLembrete2h: boolean;
  notificarPorWhatsApp: boolean;
  cancelamentoMinimoHoras: number;
  maximoFaltas: number;
}

/**
 * Classe de serviço para gerenciar a base de cadastros (simulando um backend).
 * Utiliza o padrão Singleton para garantir uma única instância em toda a aplicação.
 */
export class BaseCadastroService {
  private static instance: BaseCadastroService;

  private pacientes: Map<string, Paciente> = new Map();
  private profissionais: Map<string, Profissional> = new Map();
  private unidades: Map<string, UnidadeSaude> = new Map();
  private agendas: Map<string, Agenda> = new Map();

  private configuracoes: ConfiguracoesAgenda = {
    antecedenciaMinimaDias: 1,
    antecedenciaMaximaDias: 60,
    enviarLembrete24h: true,
    enviarLembrete2h: true,
    notificarPorWhatsApp: false,
    cancelamentoMinimoHoras: 2,
    maximoFaltas: 3,
  };

  private constructor() {
    this.popularDadosIniciais();
  }

  public static getInstance(): BaseCadastroService {
    if (!BaseCadastroService.instance) {
      BaseCadastroService.instance = new BaseCadastroService();
    }
    return BaseCadastroService.instance;
  }

  public buscarTodasAgendas = (): Agenda[] => Array.from(this.agendas.values());
  public buscarAgenda = (id: string): Agenda | undefined => this.agendas.get(id);

  public buscarTodosProfissionais = (): Profissional[] => Array.from(this.profissionais.values());
  public buscarTodasUnidades = (): UnidadeSaude[] => Array.from(this.unidades.values()).filter(u => u.ativo);

  public criarAgenda(dados: Omit<Agenda, 'id' | 'horarios' | 'cotaUtilizada' | 'cotaReservada' | 'bloqueada' | 'criadaEm' | 'atualizadaEm'>): Agenda {
    const id = `agenda-${Date.now()}`;
    const horarios: SlotHorario[] = [];
    for (let i = 8; i < 17; i++) {
      horarios.push({ hora: `${i.toString().padStart(2, '0')}:00`, disponivel: true, tipo: 'normal' });
      horarios.push({ hora: `${i.toString().padStart(2, '0')}:30`, disponivel: true, tipo: 'normal' });
    }

    const novaAgenda: Agenda = {
      ...dados,
      id,
      horarios,
      cotaUtilizada: 0,
      cotaReservada: 0,
      bloqueada: false,
      criadaEm: new Date(),
      atualizadaEm: new Date(),
    };
    this.adicionarAgenda(novaAgenda);
    return novaAgenda;
  }

  public bloquearAgenda(agendaId: string, bloquear: boolean, motivo?: string): Agenda | undefined {
    const agenda = this.buscarAgenda(agendaId);
    if (agenda) {
      agenda.bloqueada = bloquear;
      agenda.motivoBloqueio = bloquear ? motivo : undefined;
      agenda.atualizadaEm = new Date();
    }
    return agenda;
  }

  public buscarConfiguracoes = (): ConfiguracoesAgenda => this.configuracoes;

  public salvarConfiguracoes(novasConfiguracoes: ConfiguracoesAgenda): void {
    this.configuracoes = novasConfiguracoes;
    console.log('Configurações salvas:', this.configuracoes);
  }

  public adicionarPaciente = (paciente: Paciente): void => { this.pacientes.set(paciente.id, paciente); };
  public buscarPaciente = (id: string): Paciente | undefined => this.pacientes.get(id);

  public adicionarProfissional = (profissional: Profissional): void => { this.profissionais.set(profissional.id, profissional); };
  public buscarProfissional = (id: string): Profissional | undefined => this.profissionais.get(id);

  public adicionarUnidade = (unidade: UnidadeSaude): void => { this.unidades.set(unidade.id, unidade); };
  public buscarUnidade = (id: string): UnidadeSaude | undefined => this.unidades.get(id);

  private adicionarAgenda = (agenda: Agenda): void => { this.agendas.set(agenda.id, agenda); };

  private popularDadosIniciais(): void {
    // Simulação de dados iniciais
  }
}

export const baseCadastro = BaseCadastroService.getInstance();