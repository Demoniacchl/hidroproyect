// dto/CalendarioDTO.java
package com.hidro.manh.dto;

import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.enums.EstadoEvento;

import java.time.LocalDateTime;

public class CalendarioDTO {
    private Long idCalendario;
    private Long idCliente;
    private String nombreCliente;
    private Long idEquipo;
    private Long idUbicacion;
    private String nombreEquipo;
    private Long idTecnico;
    private String nombreTecnico;
    private TipoEvento tipoEvento;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoEvento estado;
    private Boolean notificado;
    private Long idOrdenMantenimiento;
    private Long idOrdenReparacion;
    
    // Constructores
    public CalendarioDTO() {}
    
    public CalendarioDTO(
        Long idCalendario,
        Long idCliente,
        String nombreCliente,
        Long idEquipo,
        String nombreEquipo,
        Long idTecnico,
        String nombreTecnico,
        TipoEvento tipoEvento,
        String titulo,
        String descripcion,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        EstadoEvento estado, Boolean notificado) {
        this.idCalendario = idCalendario;
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
        this.idEquipo = idEquipo;
        this.nombreEquipo = nombreEquipo;
        this.idTecnico = idTecnico;
        this.nombreTecnico = nombreTecnico;
        this.tipoEvento = tipoEvento;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.notificado = notificado;
    }
    
    // Getters y Setters
    public Long getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Long idCalendario) { this.idCalendario = idCalendario; }
    
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    
    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    
    public Long getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Long idEquipo) { this.idEquipo = idEquipo; }
    
    public Long getIdUbicacion() { return idUbicacion; }
    public void setIdUbicacion(Long idUbicacion) { this.idUbicacion = idUbicacion; }

    public String getNombreEquipo() { return nombreEquipo; }
    public void setNombreEquipo(String nombreEquipo) { this.nombreEquipo = nombreEquipo; }
    
    public Long getIdTecnico() { return idTecnico; }
    public void setIdTecnico(Long idTecnico) { this.idTecnico = idTecnico; }
    
    public String getNombreTecnico() { return nombreTecnico; }
    public void setNombreTecnico(String nombreTecnico) { this.nombreTecnico = nombreTecnico; }
    
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
    
    public EstadoEvento getEstado() { return estado; }
    public void setEstado(EstadoEvento estado) { this.estado = estado; }
    
    public Boolean getNotificado() { return notificado; }
    public void setNotificado(Boolean notificado) { this.notificado = notificado; }
    
    public Long getIdOrdenMantenimiento() { return idOrdenMantenimiento; }
    public void setIdOrdenMantenimiento(Long idOrdenMantenimiento) { this.idOrdenMantenimiento = idOrdenMantenimiento; }
    
    public Long getIdOrdenReparacion() { return idOrdenReparacion; }
    public void setIdOrdenReparacion(Long idOrdenReparacion) { this.idOrdenReparacion = idOrdenReparacion; }
}