package com.hidro.manh.dto;

import lombok.*;
import com.hidro.manh.enums.RolUsuario;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDto {
    private Long idUsuario;
    private String nombre;
    private RolUsuario rol;
    private String usuario;
    private String contrasena; // send plain password when creating/updating
}
