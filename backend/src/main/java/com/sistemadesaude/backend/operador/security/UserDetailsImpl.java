package com.sistemadesaude.backend.operador.security;

import com.sistemadesaude.backend.operador.entity.Operador;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    private final Operador operador;

    public UserDetailsImpl(Operador operador) {
        this.operador = operador;
    }

    public Operador getOperador() {
        return operador;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converte a lista de perfis (String) para uma coleção de GrantedAuthority
        // Adiciona o prefixo "ROLE_" que o Spring Security usa por padrão
        if (operador.getPerfis() == null) {
            return Collections.emptyList();
        }
        return operador.getPerfis().stream()
                .map(perfil -> new SimpleGrantedAuthority("ROLE_" + perfil))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return operador.getSenha();
    }

    @Override
    public String getUsername() {
        return operador.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}