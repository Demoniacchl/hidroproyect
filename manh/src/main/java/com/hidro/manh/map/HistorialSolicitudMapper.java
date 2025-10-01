package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.HistorialSolicitud;
import com.hidro.manh.dto.HistorialSolicitudDto;

@Mapper(componentModel = "spring")
public interface HistorialSolicitudMapper {
    @Mapping(source = "solicitud.idSolicitud", target = "idSolicitud")
    @Mapping(source = "usuarioCambio.idUsuario", target = "usuarioCambio")
    HistorialSolicitudDto toDto(HistorialSolicitud entity);

    @Mapping(source = "idSolicitud", target = "solicitud.idSolicitud")
    @Mapping(source = "usuarioCambio", target = "usuarioCambio.idUsuario")
    HistorialSolicitud toEntity(HistorialSolicitudDto dto);
}
