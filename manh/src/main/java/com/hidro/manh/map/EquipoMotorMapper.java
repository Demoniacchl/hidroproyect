package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.dto.EquipoMotorDto;

@Mapper(componentModel = "spring")
public interface EquipoMotorMapper {
    @Mapping(source = "ubicacion.idUbicacion", target = "idUbicacion")
    EquipoMotorDto toDto(EquipoMotor entity);

    @Mapping(source = "idUbicacion", target = "ubicacion.idUbicacion")
    EquipoMotor toEntity(EquipoMotorDto dto);
}
