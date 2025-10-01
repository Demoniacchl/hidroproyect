package com.hidro.manh.map;

import com.hidro.manh.ety.Ubicacion;
import com.hidro.manh.dto.UbicacionDto;

public class UbicacionMapper {

    public static UbicacionDto toDTO(Ubicacion ubicacion) {
        if (ubicacion == null) return null;

        return UbicacionDto.builder()
                .idUbicacion(ubicacion.getIdUbicacion())
                .nombre(ubicacion.getNombre())
                .region(ubicacion.getRegion() != null ? ubicacion.getRegion().getRegion() : null)
                .comuna(ubicacion.getComuna() != null ? ubicacion.getComuna().getComuna() : null)
                .calle(ubicacion.getCalle())
                .numero(ubicacion.getNumero())
                .build();
    }
}
