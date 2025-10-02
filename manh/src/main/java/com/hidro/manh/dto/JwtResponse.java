package com.hidro.manh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String rol;
    private String nombre;
    
    public JwtResponse(String token, String username, String rol, String nombre) {
        this.token = token;
        this.username = username;
        this.rol = rol;
        this.nombre = nombre;
    }
}