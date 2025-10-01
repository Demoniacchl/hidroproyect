package com.hidro.manh.dto;

import lombok.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialSolicitudDto {
    private Long idHistorial;
    private Long idSolicitud;
    private Long usuarioCambio;
    private Date fechaCambio;
    private String campoModificado;
    private String valorAnterior;
    private String valorNuevo;
    private String observaciones;
}
