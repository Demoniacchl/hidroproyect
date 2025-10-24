package com.hidro.manh.ety;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.hidro.manh.enums.EstadoEvento;
import com.hidro.manh.enums.TipoEvento;

@Entity
@Table(name = "calendario")
public class Calendario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCalendario;
    
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "id_equipo")
    private EquipoMotor equipo;
    
    @Column(name = "id_ubicacion") 
    private Long idUbicacion;

    @Enumerated(EnumType.STRING)
    private TipoEvento tipoEvento;
    
    private String titulo;
    private String descripcion;
    
    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;
    
    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;
    
    @ManyToOne
    @JoinColumn(name = "id_tecnico", nullable = true)
    private Usuario tecnico;
    
    @Enumerated(EnumType.STRING)
    private EstadoEvento estado;
    
    private Boolean notificado = false;
    
    @ManyToOne
    @JoinColumn(name = "id_orden_mantenimiento")
    private OrdenMantenimiento ordenMantenimiento;
    
    @ManyToOne
    @JoinColumn(name = "id_orden_reparacion")
    private OrdenReparacion ordenReparacion;
    
    // Constructores
    public Calendario() {}
    
    public Calendario(Long idCalendario, Cliente cliente, EquipoMotor equipo, TipoEvento tipoEvento, 
                     String titulo, String descripcion, LocalDateTime fechaInicio, LocalDateTime fechaFin, 
                     Usuario tecnico, EstadoEvento estado, Boolean notificado) {
        this.idCalendario = idCalendario;
        this.cliente = cliente;
        this.equipo = equipo;
        this.tipoEvento = tipoEvento;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.tecnico = tecnico;
        this.estado = estado;
        this.notificado = notificado;
    }
    
    // Getters y Setters
    public Long getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Long idCalendario) { this.idCalendario = idCalendario; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public EquipoMotor getEquipo() { return equipo; }
    public void setEquipo(EquipoMotor equipo) { this.equipo = equipo; }
    
    public TipoEvento getTipoEvento() { return tipoEvento; }
    public void setTipoEvento(TipoEvento tipoEvento) { this.tipoEvento = tipoEvento; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
    
    public Usuario getTecnico() { return tecnico; }
    public void setTecnico(Usuario tecnico) { this.tecnico = tecnico; }
    
    public EstadoEvento getEstado() { return estado; }
    public void setEstado(EstadoEvento estado) { this.estado = estado; }
    
    public Boolean getNotificado() { return notificado; }
    public void setNotificado(Boolean notificado) { this.notificado = notificado; }
    
    public OrdenMantenimiento getOrdenMantenimiento() { return ordenMantenimiento; }
    public void setOrdenMantenimiento(OrdenMantenimiento ordenMantenimiento) { this.ordenMantenimiento = ordenMantenimiento; }
    
    public OrdenReparacion getOrdenReparacion() { return ordenReparacion; }
    public void setOrdenReparacion(OrdenReparacion ordenReparacion) { this.ordenReparacion = ordenReparacion; }

    public Long getIdUbicacion() { return idUbicacion; }
    public void setIdUbicacion(Object idUbicacion) { this.idUbicacion = (Long) idUbicacion; }
}