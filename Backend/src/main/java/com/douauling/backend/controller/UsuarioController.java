package com.douauling.backend.controller;

import com.douauling.backend.model.Usuario;
import com.douauling.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public Usuario me(@RequestParam String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @PutMapping("/avatar")
    public Usuario atualizarAvatar(
            @RequestParam String email,
            @RequestBody Map<String, String> body
    ) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setAvatar(body.get("avatar"));

        return usuarioRepository.save(usuario);
    }

    @PutMapping("/senha")
    public Usuario atualizarSenha(
            @RequestParam String email,
            @RequestBody Map<String, String> body
    ) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setSenha(passwordEncoder.encode(body.get("senha")));

        return usuarioRepository.save(usuario);
    }
    @PutMapping("/nome")
    public Usuario atualizarNome(
            @RequestParam String email,
            @RequestBody Map<String, String> body
    ) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(body.get("nome"));

        return usuarioRepository.save(usuario);
    }
    @PutMapping("/recuperar-senha")
    public Map<String, String> recuperarSenha(
            @RequestBody Map<String, String> body
    ) {
        String email = body.get("email");
        String novaSenha = body.get("novaSenha");

        if (email == null || email.isBlank()) {
            throw new RuntimeException("E-mail é obrigatório");
        }

        if (novaSenha == null || novaSenha.length() < 6) {
            throw new RuntimeException("A senha precisa ter pelo menos 6 caracteres");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        usuario.setSenha(passwordEncoder.encode(novaSenha));

        usuarioRepository.save(usuario);

        return Map.of("mensagem", "Senha redefinida com sucesso");
    }
}