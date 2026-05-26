package com.douauling.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "desafios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Desafio {

    @Id
    private Long id;

    private String titulo;

    private Integer xp;

    private String trilha;

    private String nivel;

    private String rota;
}