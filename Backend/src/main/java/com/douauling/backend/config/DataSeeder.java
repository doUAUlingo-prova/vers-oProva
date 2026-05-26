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

        if (desafioRepository.count() == 0) {

            desafioRepository.save(
                    Desafio.builder()
                            .id(1L)
                            .titulo("Criando um Bucket S3")
                            .xp(50)
                            .trilha("AWS")
                            .nivel("Fácil")
                            .rota("/awschalenge/facil?id=1")
                            .build()
            );

            desafioRepository.save(
                    Desafio.builder()
                            .id(2L)
                            .titulo("EC2 com servidor web")
                            .xp(120)
                            .trilha("AWS")
                            .nivel("Médio")
                            .rota("/awschalenge/medio?id=2")
                            .build()
            );

            desafioRepository.save(
                    Desafio.builder()
                            .id(3L)
                            .titulo("EC2 acessando S3")
                            .xp(250)
                            .trilha("AWS")
                            .nivel("Difícil")
                            .rota("/awschalenge/dificil?id=3")
                            .build()
            );
        }
    }
}