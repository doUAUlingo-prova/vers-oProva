package com.douauling.backend.dto;

public record AuthResponse(
        String token,
        UsuarioResponse usuario
) {}
