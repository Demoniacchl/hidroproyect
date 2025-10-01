package com.hidro.manh.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionDto {
    private Long idUbicacion;
    private String nombre;

    private String region; // nombre de la región
    private String comuna; // nombre de la comuna

    private String calle;
    private String numero;
}
