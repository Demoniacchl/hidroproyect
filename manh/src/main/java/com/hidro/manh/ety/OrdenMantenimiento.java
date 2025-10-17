package com.hidro.manh.ety;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;
import com.hidro.manh.enums.EstadoMantenimiento;
import com.hidro.manh.enums.TipoOrden;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orden_mantenimiento")
public class OrdenMantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_motor", nullable = false)
    private EquipoMotor motor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tecnico", nullable = false)
    private Usuario tecnico;

    @Column(name = "hora_ingreso")
    private Date horaIngreso;

    @Column(name = "hora_salida")
    private Date horaSalida;

    @Column(name = "r", precision = 10, scale = 2)
    private BigDecimal r;

    @Column(name = "s", precision = 10, scale = 2)
    private BigDecimal s;

    @Column(name = "t", precision = 10, scale = 2)
    private BigDecimal t;

    @Column(name = "voltaje", precision = 10, scale = 2)
    private BigDecimal voltaje;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "firma_cliente", length = 200)
    private String firmaCliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_orden", length = 50)
    private TipoOrden tipoOrden;

    @Column(name = "campo_adicional", length = 200)
    private String campoAdicional;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_rodamientos")
    private EstadoMantenimiento cambioRodamientos;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_sello")
    private EstadoMantenimiento cambioSello;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_voluta")
    private EstadoMantenimiento cambioVoluta;

    @Enumerated(EnumType.STRING)
    @Column(name = "rebobino_campos")
    private EstadoMantenimiento rebobinoCampos;

    @Enumerated(EnumType.STRING)
    @Column(name = "protecciones_saltadas")
    private EstadoMantenimiento proteccionesSaltadas;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_protecciones")
    private EstadoMantenimiento cambioProtecciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "contactores_quemados")
    private EstadoMantenimiento contactoresQuemados;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_contactores")
    private EstadoMantenimiento cambioContactores;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_luces_piloto")
    private EstadoMantenimiento cambioLucesPiloto;

    @Enumerated(EnumType.STRING)
    @Column(name = "limpio_tablero")
    private EstadoMantenimiento limpioTablero;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_presostato")
    private EstadoMantenimiento cambioPresostato;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_manometro")
    private EstadoMantenimiento cambioManometro;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo_con_aire_ep")
    private EstadoMantenimiento cargoConAireEp;

    @Enumerated(EnumType.STRING)
    @Column(name = "reviso_presion_ep")
    private EstadoMantenimiento revisoPresionEp;

    @Enumerated(EnumType.STRING)
    @Column(name = "cambio_valv_retencion")
    private EstadoMantenimiento cambioValvRetencion;

    @Enumerated(EnumType.STRING)
    @Column(name = "suprimo_filtracion")
    private EstadoMantenimiento suprimoFiltracion;

    @Enumerated(EnumType.STRING)
    @Column(name = "reviso_valv_compuerta")
    private EstadoMantenimiento revisoValvCompuerta;

    @Enumerated(EnumType.STRING)
    @Column(name = "reviso_valv_flotador")
    private EstadoMantenimiento revisoValvFlotador;

    @Enumerated(EnumType.STRING)
    @Column(name = "reviso_estanque_agua")
    private EstadoMantenimiento revisoEstanqueAgua;

    @Enumerated(EnumType.STRING)
    @Column(name = "reviso_fittings_otros")
    private EstadoMantenimiento revisoFittingsOtros;

        @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ubicacion")
    private Ubicacion ubicacion;
}
