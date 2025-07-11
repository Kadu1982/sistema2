/**
 * Interface que representa um paciente completo.
 * Corresponde ao PacienteDTO no backend.
 */
export interface Paciente {
  id?: number;
  nomeCompleto: string;
  nomeSocial?: string;
  nomeMae?: string;
  cpf?: string;
  justificativaAusenciaCpf?: string;
  cns?: string;
  sexo?: string;
  dataNascimento?: string; // Formato ISO: YYYY-MM-DD
  acamado?: boolean;
  domiciliado?: boolean;
  condSaudeMental?: boolean;
  usaPlantas?: boolean;
  outrasCondicoes?: string;
  
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
}

/**
 * Interface que representa um paciente em formato de listagem.
 * Corresponde ao PacienteListDTO no backend.
 */
export interface PacienteList {
  id: number;
  nomeCompleto: string;
  nomeSocial?: string;
  cpf?: string;
  cns?: string;
  dataNascimento?: string; // Formato ISO: YYYY-MM-DD
  idade?: number;
}