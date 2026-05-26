package com.douauling.backend.repository;

import com.douauling.backend.model.Desafio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesafioRepository extends JpaRepository<Desafio, Long> {
}