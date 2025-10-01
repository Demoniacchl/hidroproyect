package com.hidro.manh.map;

import org.mapstruct.*;


import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.dto.OrdenReparacionDto;

@Mapper(componentModel = "spring")
public interface OrdenReparacionMapper {
    @Mapping(source = "motor.idMotor", target = "idMotor")
    @Mapping(source = "tecnico.idUsuario", target = "idTecnico")
    OrdenReparacionDto toDto(OrdenReparacion entity);

    @Mapping(source = "idMotor", target = "motor.idMotor")
    @Mapping(source = "idTecnico", target = "tecnico.idUsuario")
    OrdenReparacion toEntity(OrdenReparacionDto dto);
}
