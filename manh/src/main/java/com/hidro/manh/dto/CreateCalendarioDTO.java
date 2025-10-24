// dto/CreateCalendarioDTO.java
package com.hidro.manh.dto;

import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.enums.EstadoEvento;

import java.time.LocalDateTime;

public class CreateCalendarioDTO {
    private Long idCliente;
    private Long idEquipo;
    private Long idTecnico;
    private Long idUbicacion; // ✅ CORRECTO: Long
    private TipoEvento tipoEvento;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoEvento estado;
    
    // Constructores
    public CreateCalendarioDTO() {}
    
    // Getters y Setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    
    public Long getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Long idEquipo) { this.idEquipo = idEquipo; }
    
    public Long getIdTecnico() { return idTecnico; }
    public void setIdTecnico(Long idTecnico) { this.idTecnico = idTecnico; }
    
    public Long getIdUbicacion() { return idUbicacion; } // ✅ CORRECTO
    public void setIdUbicacion(Long idUbicacion) { this.idUbicacion = idUbicacion; }
    
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
}