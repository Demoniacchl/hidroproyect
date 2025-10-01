package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import com.hidro.manh.enums.RolUsuario;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private RolUsuario rol;

    @Column(name = "usuario", length = 50, unique = true)
    private String usuario;

    @Column(name = "contrasena", length = 255)
    private String contrasena;
}
