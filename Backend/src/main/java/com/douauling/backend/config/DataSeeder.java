package com.douauling.backend.config;

import com.douauling.backend.model.Desafio;
import com.douauling.backend.repository.DesafioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DesafioRepository desafioRepository;

    @Override
    public void run(String... args) {
        salvarSeNaoExistir(1L, "Criando um Bucket S3", 50, "AWS", "Fácil", "/awschalenge/facil?id=1");
        salvarSeNaoExistir(2L, "EC2 com servidor web", 120, "AWS", "Médio", "/awschalenge/medio?id=2");
        salvarSeNaoExistir(3L, "EC2 acessando S3", 250, "AWS", "Difícil", "/awschalenge/dificil?id=3");

        salvarSeNaoExistir(4L, "Primeira tela no Expo", 40, "Expo", "Fácil", "/expochalenge/facil?id=4");
        salvarSeNaoExistir(5L, "Navegação com Expo Router", 100, "Expo", "Médio", "/expochalenge/medio?id=5");
        salvarSeNaoExistir(6L, "Consumindo API no Expo", 200, "Expo", "Difícil", "/expochalenge/dificil?id=6");
    }

    private void salvarSeNaoExistir(
            Long id,
            String titulo,
            Integer xp,
            String trilha,
            String nivel,
            String rota
    ) {
        if (desafioRepository.existsById(id)) {
            return;
        }

        Desafio desafio = Desafio.builder()
                .id(id)
                .titulo(titulo)
                .xp(xp)
                .trilha(trilha)
                .nivel(nivel)
                .rota(rota)
                .build();

        desafioRepository.save(desafio);
    }
}