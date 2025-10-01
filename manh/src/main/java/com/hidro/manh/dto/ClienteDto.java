package com.hidro.manh.dto;

import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ClienteDto {
    private Long idCliente;
    private Integer nCliente;
    private String nombre1;
    private String rut;
    private String telefono1;
    private String nombre2;
    private String telefono2;
    private String correo;
    private String observaciones;
    private List<UbicacionDto> ubicaciones;
}
