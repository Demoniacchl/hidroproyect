package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "equipo_motor")
public class EquipoMotor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_motor")
    private Long idMotor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ubicacion", nullable = false)
    private Ubicacion ubicacion;

    @Column(name = "tipo", length = 50)
    private String tipo;

    @Column(name = "marca", length = 50)
    private String marca;

    @Column(name = "modelo", length = 50)
    private String modelo;

    @Column(name = "potencia", precision = 10, scale = 2)
    private BigDecimal potencia;

    @Column(name = "voltaje", precision = 10, scale = 2)
    private BigDecimal voltaje;

    @Column(name = "r", precision = 10, scale = 2)
    private BigDecimal r;

    @Column(name = "s", precision = 10, scale = 2)
    private BigDecimal s;

    @Column(name = "t", precision = 10, scale = 2)
    private BigDecimal t;

    @Column(name = "serie", length = 100)
    private String serie;

    @Column(name = "fecha_instalacion")
    private Date fechaInstalacion;

    @Column(name = "estado", length = 50)
    private String estado;
}
