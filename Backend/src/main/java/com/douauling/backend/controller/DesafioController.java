package com.douauling.backend.controller;

import com.douauling.backend.model.Desafio;
import com.douauling.backend.repository.DesafioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/desafios")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DesafioController {

    private final DesafioRepository desafioRepository;

    @GetMapping
    public List<Desafio> listar() {
        return desafioRepository.findAll();
    }
}