package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.hidro.manh.enums.ProgresoReparacion;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orden_reparacion")
public class OrdenReparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden_reparacion")
    private Long idOrdenReparacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_motor", nullable = false)
    private EquipoMotor motor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tecnico", nullable = false)
    private Usuario tecnico;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "progreso")
    private ProgresoReparacion progreso;

    @Column(name = "firma_cliente", length = 200)
    private String firmaCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
        @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ubicacion")
    private Ubicacion ubicacion;
}
