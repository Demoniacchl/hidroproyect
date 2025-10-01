package com.hidro.manh.dto;

import lombok.*;
import java.util.Date;
import com.hidro.manh.enums.ProgresoReparacion;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenReparacionDto {
    private Long idOrdenReparacion;
    private Long idMotor;
    private Long idTecnico;
    private Date fecha;
    private String observaciones;
    private ProgresoReparacion progreso;
    private String firmaCliente;
}
