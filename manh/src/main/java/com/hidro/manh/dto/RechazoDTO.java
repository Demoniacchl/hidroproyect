package com.hidro.manh.dto;

import java.time.LocalDateTime;

public class RechazoDTO {
    private Long idAdmin;
    private String motivo;
    private String observaciones;
    private LocalDateTime fechaRechazo;
    
    public RechazoDTO() {}
    
    // Getters y Setters
    public Long getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Long idAdmin) { this.idAdmin = idAdmin; }
    
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public LocalDateTime getFechaRechazo() { return fechaRechazo; }
    public void setFechaRechazo(LocalDateTime fechaRechazo) { this.fechaRechazo = fechaRechazo; }
}