package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.dto.OrdenMantenimientoDto;

@Mapper(componentModel = "spring")
public interface OrdenMantenimientoMapper {
    @Mapping(source = "motor.idMotor", target = "idMotor")
    @Mapping(source = "tecnico.idUsuario", target = "idTecnico")
    OrdenMantenimientoDto toDto(OrdenMantenimiento entity);

    @Mapping(source = "idMotor", target = "motor.idMotor")
    @Mapping(source = "idTecnico", target = "tecnico.idUsuario")
    OrdenMantenimiento toEntity(OrdenMantenimientoDto dto);
}
