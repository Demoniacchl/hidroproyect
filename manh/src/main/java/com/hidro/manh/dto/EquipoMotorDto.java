package com.hidro.manh.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipoMotorDto {
    private Long idMotor;
    private Long idUbicacion;
    private String tipo;
    private String marca;
    private String modelo;
    private BigDecimal potencia;
    private BigDecimal voltaje;
    private BigDecimal r;
    private BigDecimal s;
    private BigDecimal t;
    private String serie;
    private Date fechaInstalacion;
    private String estado;
}
