package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.dto.OrdenReparacionDto;

@Mapper(componentModel = "spring")
public interface OrdenReparacionMapper {
    
    @Mapping(source = "motor.idMotor", target = "idMotor")
    @Mapping(source = "tecnico.idUsuario", target = "idTecnico")
    @Mapping(source = "cliente.idCliente", target = "idCliente") 
    @Mapping(source = "ubicacion.idUbicacion", target = "idUbicacion")
    OrdenReparacionDto toDto(OrdenReparacion entity);

    @Mapping(source = "idMotor", target = "motor.idMotor")
    @Mapping(source = "idTecnico", target = "tecnico.idUsuario")
    @Mapping(source = "idCliente", target = "cliente.idCliente")
    @Mapping(source = "idUbicacion", target = "ubicacion.idUbicacion")
    OrdenReparacion toEntity(OrdenReparacionDto dto);
}