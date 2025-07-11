import { Paciente } from '@/types/Paciente';

// Lista de pacientes para simulação e testes.
export const pacientes: Paciente[] = [
  {
    id: '1',
    nome: 'Maria da Silva',
    dataNascimento: '1990-05-15',
    cpf: '111.222.333-44',
    cns: '980016283459876',
    cartaoSus: '898001012345678',
    sexo: 'F',
    email: 'maria.silva@example.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores, 123',
    nomeMae: 'Ana da Silva',
    cpfMae: '999.888.777-66',
    nomePai: 'João da Silva',
    unidadeSaude: 'UBS Centro',
    microarea: '01',
    equipeESF: 'Equipe Azul',
    acs: 'Carlos',
    condicoesCronicas: ['Hipertensão'],
    ultimaConsulta: '2024-05-20',
  },
  {
    id: '2',
    nome: 'João Santos',
    dataNascimento: '1985-02-20',
    cpf: '222.333.444-55',
    cns: '980016283451234',
    cartaoSus: '898001012349876',
    sexo: 'M',
    email: 'joao.santos@example.com',
    telefone: '(21) 99999-8888',
    endereco: 'Avenida Brasil, 456',
    nomeMae: 'Teresa Santos',
    cpfMae: '888.777.666-55',
    nomePai: 'Pedro Santos',
    unidadeSaude: 'UBS Copacabana',
    microarea: '03',
    equipeESF: 'Equipe Verde',
    acs: 'Mariana',
    condicoesCronicas: ['Diabetes'],
    ultimaConsulta: '2024-06-01',
  },
  {
    id: '3',
    nome: 'Maria da Silva', // Nome igual ao paciente 1 para teste de duplicidade
    dataNascimento: '1990-05-15', // Data de nascimento igual ao paciente 1
    cpf: '333.444.555-66',
    cns: '980016283455432',
    cartaoSus: '898001012344567',
    sexo: 'F',
    email: 'maria.d.silva@example.com',
    telefone: '(31) 98888-7777',
    endereco: 'Rua dos Inconfidentes, 789',
    nomeMae: 'Ana da Silva', // Nome da mãe igual ao paciente 1
    cpfMae: '999.888.777-66',
    nomePai: 'José da Silva',
    unidadeSaude: 'UBS Savassi',
    microarea: '12',
    equipeESF: 'Equipe Amarela',
  },
];