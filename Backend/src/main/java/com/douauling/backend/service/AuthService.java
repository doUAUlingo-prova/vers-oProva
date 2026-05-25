package com.douauling.backend.service;

import com.douauling.backend.dto.AuthResponse;
import com.douauling.backend.dto.LoginRequest;
import com.douauling.backend.dto.RegisterRequest;
import com.douauling.backend.dto.UsuarioResponse;
import com.douauling.backend.model.Usuario;
import com.douauling.backend.repository.UsuarioRepository;
import com.douauling.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("Este e-mail já está cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome().trim())
                .email(email)
                .senha(passwordEncoder.encode(request.senha()))
                .xp(0)
                .nivel(1)
                .build();

        Usuario salvo = usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(salvo.getEmail());

        return new AuthResponse(token, UsuarioResponse.fromEntity(salvo));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha inválidos");
        }

        String token = jwtService.gerarToken(usuario.getEmail());
        return new AuthResponse(token, UsuarioResponse.fromEntity(usuario));
    }

    public UsuarioResponse me(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return UsuarioResponse.fromEntity(usuario);
    }
}
