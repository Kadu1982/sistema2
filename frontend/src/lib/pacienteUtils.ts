import { Paciente } from '@/types/Paciente';

/**
 * Obtém o nome de exibição correto do paciente
 * Se o sexo for 'OUTRO' e houver nome social, usa o nome social
 * Caso contrário, usa o nome completo
 */
export const obterNomeExibicao = (paciente: Paciente): string => {
    if (paciente.sexo === 'OUTRO' && paciente.nomeSocial && paciente.nomeSocial.trim() !== '') {
        return paciente.nomeSocial;
    }
    return paciente.nomeCompleto;
};

/**
 * Formata o nome com indicador visual quando aplicável
 * @param paciente - O objeto paciente
 * @param mostrarIndicador - Se deve mostrar o indicador "(nome social)"
 */
export const formatarNomeComIndicador = (paciente: Paciente, mostrarIndicador: boolean = true): string => {
    const nomeExibicao = obterNomeExibicao(paciente);

    if (mostrarIndicador && paciente.sexo === 'OUTRO' && paciente.nomeSocial && paciente.nomeSocial.trim() !== '') {
        return `${nomeExibicao} (nome social)`;
    }

    return nomeExibicao;
};

/**
 * Formata CPF para exibição
 * @param cpf - CPF como string ou null
 */
export const formatarCpf = (cpf: string | null): string => {
    if (!cpf) return 'CPF não informado';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
};

/**
 * Formata telefone para exibição
 * @param telefone - Telefone como string ou null
 */
export const formatarTelefone = (telefone: string | null): string => {
    if (!telefone) return 'Telefone não informado';
    const digits = telefone.replace(/\D/g, '');

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return telefone;
};

/**
 * Verifica se o paciente tem telefone válido
 * @param telefone - Telefone como string ou null
 */
export const temTelefone = (telefone: string | null): boolean => {
    return telefone !== null && telefone.trim() !== '';
};

/**
 * Aplica máscara ao CPF durante a digitação
 * @param value - Valor do CPF
 */
export const aplicarMascaraCpf = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
};

/**
 * Remove máscara do CPF para envio ao backend
 * @param value - CPF formatado
 */
export const removerMascaraCpf = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Valida se CPF é válido (algoritmo oficial)
 * @param cpf - CPF para validar
 */
export const validarCpf = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(digits)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(digits[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(digits[9])) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(digits[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(digits[10])) return false;

    return true;
};

/**
 * Formata data para exibição brasileira
 * @param data - Data como string ISO ou Date
 */
export const formatarDataBrasil = (data: string | Date | null): string => {
    if (!data) return 'Data não informada';

    try {
        const dataObj = typeof data === 'string' ? new Date(data) : data;
        return dataObj.toLocaleDateString('pt-BR');
    } catch {
        return 'Data inválida';
    }
};

/**
 * Calcula idade a partir da data de nascimento
 * @param dataNascimento - Data de nascimento como string ISO
 */
export const calcularIdade = (dataNascimento: string | null): number | null => {
    if (!dataNascimento) return null;

    try {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const diaAtual = hoje.getDate();

        if (mesAtual < nascimento.getMonth() ||
            (mesAtual === nascimento.getMonth() && diaAtual < nascimento.getDate())) {
            idade--;
        }

        return idade;
    } catch {
        return null;
    }
};

/**
 * Formata idade para exibição
 * @param dataNascimento - Data de nascimento como string ISO
 */
export const formatarIdade = (dataNascimento: string | null): string => {
    const idade = calcularIdade(dataNascimento);
    if (idade === null) return 'Idade não informada';
    return `${idade} anos`;
};