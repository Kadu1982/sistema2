
package com.sistemadesaude.backend.perfilacesso.entity;

import lombok.Getter;

/**
 * Enum que define os tipos de perfis disponíveis no sistema
 */
@Getter
public enum Perfil {

    ADMINISTRADOR_DO_SISTEMA("ADMIN", "Administrador do Sistema", 1),
    GESTOR("GESTOR", "Gestor da Unidade", 2),
    MEDICO("MEDICO", "Médico", 3),
    ENFERMEIRO("ENFERMEIRO", "Enfermeiro", 4),
    DENTISTA("DENTISTA", "Dentista", 4),
    FARMACEUTICO("FARMACEUTICO", "Farmacêutico", 5),
    TECNICO_ENFERMAGEM("TEC_ENF", "Técnico em Enfermagem", 6),
    TECNICO_HIGIENE_DENTAL("TEC_DENTAL", "Técnico em Higiene Dental", 6),
    RECEPCIONISTA("RECEPCAO", "Recepcionista", 7),
    USUARIO_SISTEMA("USER", "Usuário do Sistema", 8);

    private final String codigo;
    private final String descricao;
    private final Integer nivel;

    Perfil(String codigo, String descricao, Integer nivel) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.nivel = nivel;
    }

    /**
     * Busca perfil por código
     */
    public static Perfil fromCodigo(String codigo) {
        for (Perfil perfil : values()) {
            if (perfil.codigo.equals(codigo)) {
                return perfil;
            }
        }
        throw new IllegalArgumentException("Perfil não encontrado: " + codigo);
    }

    /**
     * Verifica se é perfil administrativo
     */
    public boolean isAdmin() {
        return this == ADMINISTRADOR_DO_SISTEMA || this == GESTOR;
    }

    /**
     * Verifica se é profissional de saúde
     */
    public boolean isProfissionalSaude() {
        return this == MEDICO || this == ENFERMEIRO || this == DENTISTA ||
                this == FARMACEUTICO || this == TECNICO_ENFERMAGEM ||
                this == TECNICO_HIGIENE_DENTAL;
    }
}