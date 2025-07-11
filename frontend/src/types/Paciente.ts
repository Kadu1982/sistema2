export interface Paciente {
  id?: number;
  nomeCompleto: string;
  nomeSocial?: string;
  nomeMae?: string;
  cpf: string;
  justificativaAusenciaCpf?: string;
  cns?: string;
  cartaoSus?: string; // Para compatibilidade com código existente
  sexo?: string;
  dataNascimento: string;
  acamado?: boolean;
  domiciliado?: boolean;
  condSaudeMental?: boolean;
  usaPlantas?: boolean;
  outrasCondicoes?: string;

  // Campos legados para compatibilidade
  nome?: string; // Para compatibilidade com código existente
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  contatoEmergencia?: string;
  telefoneEmergencia?: string;
  observacoesMedicas?: string;
  prioridade?: string;

  // Endereço
  municipio?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;

  // Contato
  telefoneCelular?: string;
  telefoneContato?: string;

  // Documentos
  tipoSanguineo?: string;
  rg?: string;
  orgaoEmissor?: string;
  certidaoNascimento?: string;
  carteiraTrabalho?: string;
  tituloEleitor?: string;

  // Outros dados
  prontuarioFamiliar?: string;
  corRaca?: string;
  etnia?: string;
  escolaridade?: string;
  situacaoFamiliar?: string;
  cbo?: string;

  // Status
  ativo?: boolean;

  // Campos de auditoria
  dataCriacao?: string;
  dataAtualizacao?: string;
  criadoPor?: string;
  atualizadoPor?: string;
}

// Tipo para criação de paciente (campos obrigatórios)
export interface CriarPacienteRequest {
  // Campos obrigatórios
  nomeCompleto: string;
  dataNascimento: string;

  // Campos opcionais
  nomeSocial?: string;
  nomeMae?: string;
  cpf?: string;
  justificativaAusenciaCpf?: string;
  cns?: string;
  sexo?: string;
  acamado?: boolean;
  domiciliado?: boolean;
  condSaudeMental?: boolean;
  usaPlantas?: boolean;
  outrasCondicoes?: string;
  municipio?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  telefoneCelular?: string;
  telefoneContato?: string;
  tipoSanguineo?: string;
  rg?: string;
  orgaoEmissor?: string;
  certidaoNascimento?: string;
  carteiraTrabalho?: string;
  tituloEleitor?: string;
  prontuarioFamiliar?: string;
  corRaca?: string;
  etnia?: string;
  escolaridade?: string;
  situacaoFamiliar?: string;
  cbo?: string;

  // Campos legados para compatibilidade
  nome?: string;
  cartaoSus?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  contatoEmergencia?: string;
  telefoneEmergencia?: string;
  observacoesMedicas?: string;
}

// Tipo para atualização de paciente (todos os campos opcionais exceto ID)
export interface AtualizarPacienteRequest {
  id: number;

  // Campos opcionais
  nomeCompleto?: string;
  nomeSocial?: string;
  nomeMae?: string;
  cpf?: string;
  justificativaAusenciaCpf?: string;
  cns?: string;
  sexo?: string;
  dataNascimento?: string;
  acamado?: boolean;
  domiciliado?: boolean;
  condSaudeMental?: boolean;
  usaPlantas?: boolean;
  outrasCondicoes?: string;
  municipio?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  telefoneCelular?: string;
  telefoneContato?: string;
  tipoSanguineo?: string;
  rg?: string;
  orgaoEmissor?: string;
  certidaoNascimento?: string;
  carteiraTrabalho?: string;
  tituloEleitor?: string;
  prontuarioFamiliar?: string;
  corRaca?: string;
  etnia?: string;
  escolaridade?: string;
  situacaoFamiliar?: string;
  cbo?: string;
  ativo?: boolean;

  // Campos legados para compatibilidade
  nome?: string;
  cartaoSus?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  genero?: string;
  estadoCivil?: string;
  profissao?: string;
  contatoEmergencia?: string;
  telefoneEmergencia?: string;
  observacoesMedicas?: string;
}

// Tipo para resposta de busca
export interface PacienteBuscaResponse {
  pacientes: Paciente[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
