package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "cliente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cliente {

    @Id
    @Column(name = "id_cliente")
    private Long idCliente;
@Column(name = "n_cliente") 
    private Integer ncliente;
    private String nombre1;
    private String rut;
    private String telefono1;
    private String nombre2;
    private String telefono2;
    private String correo;
    private String observaciones;

    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Ubicacion> ubicaciones;
}
