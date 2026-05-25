package com.douauling.backend.dto;

import com.douauling.backend.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        Integer xp,
        Integer nivel
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getXp(),
                usuario.getNivel()
        );
    }
}
