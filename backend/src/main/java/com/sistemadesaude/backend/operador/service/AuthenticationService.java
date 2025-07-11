package com.sistemadesaude.backend.operador.service;

import com.sistemadesaude.backend.operador.dto.LoginRequest;
import com.sistemadesaude.backend.operador.dto.LoginResponse;
import com.sistemadesaude.backend.operador.dto.OperadorDTO;
import com.sistemadesaude.backend.operador.mapper.OperadorMapper;
import com.sistemadesaude.backend.operador.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final OperadorRepository operadorRepository;
    private final OperadorMapper operadorMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional(readOnly = true)
    public LoginResponse authenticate(LoginRequest request) {
        // 1. Autentica as credenciais usando o AuthenticationManager do Spring Security
        // ✅ CORRIGIDO: Usa request.getLogin() e request.getSenha()
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getSenha()
                )
        );

        // 2. Se a autenticação for bem-sucedida, busca o operador no banco de dados
        var operador = operadorRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new UsernameNotFoundException("Operador não encontrado com o login: " + request.getLogin()));

        // 3. Gera o token JWT para o operador encontrado
        var jwtToken = jwtService.gerarToken(operador);

        // 4. Mapeia a entidade Operador para um OperadorDTO para a resposta
        OperadorDTO operadorDTO = operadorMapper.toDTO(operador);

        // 5. Cria e retorna o LoginResponse com o token e os dados do operador
        // ✅ CORRIGIDO: Usa o construtor correto new LoginResponse(token, operadorDTO)
        return new LoginResponse(jwtToken, operadorDTO);
    }
}