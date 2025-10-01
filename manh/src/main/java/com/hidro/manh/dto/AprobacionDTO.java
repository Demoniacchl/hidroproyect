package com.hidro.manh.dto;

import java.time.LocalDateTime;

public class AprobacionDTO {
    private Long idAdmin;
    private String observaciones;
    private LocalDateTime fechaAprobacion;
    
    public AprobacionDTO() {}
    
    // Getters y Setters
    public Long getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Long idAdmin) { this.idAdmin = idAdmin; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public LocalDateTime getFechaAprobacion() { return fechaAprobacion; }
    public void setFechaAprobacion(LocalDateTime fechaAprobacion) { this.fechaAprobacion = fechaAprobacion; }
}