package com.hidro.manh.dto;

import lombok.*;
import java.util.Date;
import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.enums.TipoOrden;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudDto {
    private Long idSolicitud;
    private Long idOrden;
    private TipoOrden tipoOrden;
    private EstadoSolicitud estado;
    private Date fechaCreacion;
    private Date fechaRevision;
    private String observacionesAdmin;
}
