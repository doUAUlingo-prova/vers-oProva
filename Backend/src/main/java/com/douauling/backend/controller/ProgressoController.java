package com.douauling.backend.controller;

import com.douauling.backend.model.Desafio;
import com.douauling.backend.model.Usuario;
import com.douauling.backend.model.UsuarioDesafio;
import com.douauling.backend.repository.DesafioRepository;
import com.douauling.backend.repository.UsuarioDesafioRepository;
import com.douauling.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/progresso")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProgressoController {

    private final UsuarioRepository usuarioRepository;
    private final DesafioRepository desafioRepository;
    private final UsuarioDesafioRepository usuarioDesafioRepository;

    @PostMapping("/concluir")
    public UsuarioDesafio concluir(
            @RequestParam String email,
            @RequestParam Long desafioId
    ) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado"));

        boolean jaExiste = usuarioDesafioRepository
                .existsByUsuarioIdAndDesafioId(usuario.getId(), desafioId);

        if (jaExiste) {
            return usuarioDesafioRepository
                    .findByUsuarioId(usuario.getId())
                    .stream()
                    .filter(item -> item.getDesafio().getId().equals(desafioId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Progresso não encontrado"));
        }

        int xpAtual = usuario.getXp() != null ? usuario.getXp() : 0;
        int streakAtual = usuario.getStreak() != null ? usuario.getStreak() : 0;
        int xpDesafio = desafio.getXp() != null ? desafio.getXp() : 0;

        usuario.setXp(xpAtual + xpDesafio);
        usuario.setNivel((usuario.getXp() / 300) + 1);
        usuario.setStreak(streakAtual + 1);

        usuarioRepository.save(usuario);

        UsuarioDesafio progresso = new UsuarioDesafio();
        progresso.setUsuario(usuario);
        progresso.setDesafio(desafio);
        progresso.setConcluido(true);
        progresso.setDataConclusao(LocalDateTime.now());

        return usuarioDesafioRepository.save(progresso);
    }

    @GetMapping
    public List<UsuarioDesafio> listar(@RequestParam String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuarioDesafioRepository.findByUsuarioId(usuario.getId());
    }
}