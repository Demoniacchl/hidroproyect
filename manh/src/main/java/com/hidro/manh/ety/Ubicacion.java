package com.hidro.manh.ety;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ubicacion")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Long idUbicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", referencedColumnName = "id_cliente", nullable = false)
    @JsonIgnore
    private Cliente cliente;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "region_id")
    private Integer regionId;

    @Column(name = "comuna_id")
    private Integer comunaId;

    @Column(name = "calle", length = 255)
    private String calle;

    @Column(name = "numero", length = 20)
    private String numero;

    // Relaciones para traer nombres de referencia
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "region_id", referencedColumnName = "id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})   // 👈 agrega esta línea
private RegionEty region;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "comuna_id", referencedColumnName = "id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})   // 👈 agrega esta línea
private ComunaEty comuna;
}

