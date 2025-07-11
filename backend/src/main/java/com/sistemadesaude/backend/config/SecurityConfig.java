package com.sistemadesaude.backend.config;

import com.sistemadesaude.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Configuração de CORS centralizada diretamente na cadeia de segurança
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Desabilita o CSRF (essencial para APIs stateless com autenticação via token)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Regras de autorização de requisições
                .authorizeHttpRequests(auth -> auth
                        // Libera os endpoints de autenticação e documentação da API
                        .requestMatchers("/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                        .permitAll()
                        // Exige autenticação para todas as outras requisições
                        .anyRequest()
                        .authenticated()
                )

                // 4. Garante que a sessão será stateless (sem estado)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Define o provedor de autenticação customizado
                .authenticationProvider(authenticationProvider)

                // 6. Adiciona o filtro de JWT para validar os tokens
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // URLs do frontend que podem acessar o backend
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5011", "http://localhost:5173"));
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        // Cabeçalhos permitidos (usar "*" permite todos, incluindo o 'Authorization')
        configuration.setAllowedHeaders(List.of("*"));
        // Permite o envio de credenciais (como cookies ou tokens de autorização)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica a configuração de CORS a todas as rotas da aplicação ("/**")
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}