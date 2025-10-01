package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.Solicitud;
import com.hidro.manh.dto.SolicitudDto;

@Mapper(componentModel = "spring")
public interface SolicitudMapper {
    @Mapping(source = "ordenMantenimiento.idOrden", target = "idOrden")
    SolicitudDto toDto(Solicitud entity);

    @Mapping(source = "idOrden", target = "ordenMantenimiento.idOrden")
    Solicitud toEntity(SolicitudDto dto);
}
