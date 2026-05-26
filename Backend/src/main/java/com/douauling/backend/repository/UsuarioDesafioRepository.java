package com.douauling.backend.repository;

import com.douauling.backend.model.UsuarioDesafio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioDesafioRepository
        extends JpaRepository<UsuarioDesafio, Long> {

    List<UsuarioDesafio> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndDesafioId(
            Long usuarioId,
            Long desafioId
    );
}