// src/services/duplicateValidationService.ts

import { Paciente } from "@/types/Paciente";
import { pacientes } from "@/data/mockData";

// Define os dados mínimos para iniciar uma validação.
export type PatientData = Pick<Paciente, "nome" | "dataNascimento" | "nomeMae" | "cpfMae">;

// Define a estrutura para o resultado da validação.
export interface ValidationResult {
  isDuplicate: boolean;
  confidence?: number;
  possibleDuplicates: Paciente[];
  aiAnalysis: string;
}

// Para futuras configurações.
export interface ValidationConfig {
  strictness?: "low" | "medium" | "high";
}

/**
 * Simula a validação de duplicidade de um paciente, imitando uma chamada de API.
 */
export const validatePatientDuplicate = async (
    patientData: PatientData,
    config?: ValidationConfig
): Promise<ValidationResult> => {
  console.log("Iniciando validação para:", patientData);
  console.log("Configuração:", config);

  await new Promise(resolve => setTimeout(resolve, 1500));

  // A variável 'allPatients' foi removida para usar 'pacientes' diretamente.
  const possibleDuplicates = pacientes.filter((p: Paciente) => {
    const nameMatch = p.nome.toLowerCase().trim() === patientData.nome.toLowerCase().trim();
    const motherNameMatch = p.nomeMae?.toLowerCase().trim() === patientData.nomeMae?.toLowerCase().trim();
    const birthDateMatch = p.dataNascimento === patientData.dataNascimento;

    // Critério: considera duplicata se o nome completo E (o nome da mãe OU a data de nascimento) forem iguais.
    return nameMatch && (motherNameMatch || birthDateMatch);
  });

  const isDuplicate = possibleDuplicates.length > 0;

  if (isDuplicate) {
    return {
      isDuplicate: true,
      possibleDuplicates,
      confidence: 0.95,
      aiAnalysis: "Alta probabilidade de duplicata",
    };
  }

  return {
    isDuplicate: false,
    possibleDuplicates: [],
    confidence: 0.99,
    aiAnalysis: "Nenhuma duplicata encontrada",
  };
};