package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.enums.TipoOrden;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "solicitud")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Long idSolicitud;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden", unique = true)
    private OrdenMantenimiento ordenMantenimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_orden")
    private TipoOrden tipoOrden;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoSolicitud estado;

    @Column(name = "fecha_creacion")
    private Date fechaCreacion;

    @Column(name = "fecha_revision")
    private Date fechaRevision;

    @Column(name = "observaciones_admin", columnDefinition = "TEXT")
    private String observacionesAdmin;
}
