package com.hidro.manh.map;

import com.hidro.manh.ety.Cliente;
import com.hidro.manh.dto.ClienteDto;
import java.util.stream.Collectors;

public class ClienteMapper {

    public static ClienteDto toDTO(Cliente cliente) {
        if (cliente == null) return null;

        return ClienteDto.builder()
                .idCliente(cliente.getIdCliente())
                .nCliente(cliente.getNcliente())
                .nombre1(cliente.getNombre1())
                .rut(cliente.getRut())
                .telefono1(cliente.getTelefono1())
                .nombre2(cliente.getNombre2())
                .telefono2(cliente.getTelefono2())
                .correo(cliente.getCorreo())
                .observaciones(cliente.getObservaciones())
                .ubicaciones(cliente.getUbicaciones() != null
                        ? cliente.getUbicaciones().stream()
                            .map(UbicacionMapper::toDTO)
                            .collect(Collectors.toList())
                        : null)
                .build();
    }
}
