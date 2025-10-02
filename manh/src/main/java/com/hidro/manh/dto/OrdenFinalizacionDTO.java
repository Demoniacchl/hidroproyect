package com.hidro.manh.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

public class OrdenFinalizacionDTO {
    private Long idOrden;
    private LocalDateTime horaSalida;
    private Map<String, String> checklist; // "cambioRodamiento": "SI", "cambioSello": "NO", etc.
    private Double lecturaR;
    private Double lecturaS;
    private Double lecturaT;
    private Double voltaje;
    private String observaciones;
    private String campoAdicional;
    private String firmaCliente; // Base64 o JSON con firma
    
    public OrdenFinalizacionDTO() {}
    public Date getHoraSalidaAsDate() {
    return java.sql.Timestamp.valueOf(this.horaSalida);
}
    // Getters y Setters
    public Long getIdOrden() { return idOrden; }
    public void setIdOrden(Long idOrden) { this.idOrden = idOrden; }
    
    public LocalDateTime getHoraSalida() { return horaSalida; }
    public void setHoraSalida(LocalDateTime horaSalida) { this.horaSalida = horaSalida; }
    
    public Map<String, String> getChecklist() { return checklist; }
    public void setChecklist(Map<String, String> checklist) { this.checklist = checklist; }
    
    public Double getLecturaR() { return lecturaR; }
    public void setLecturaR(Double lecturaR) { this.lecturaR = lecturaR; }
    
    public Double getLecturaS() { return lecturaS; }
    public void setLecturaS(Double lecturaS) { this.lecturaS = lecturaS; }
    
    public Double getLecturaT() { return lecturaT; }
    public void setLecturaT(Double lecturaT) { this.lecturaT = lecturaT; }
    
    public Double getVoltaje() { return voltaje; }
    public void setVoltaje(Double voltaje) { this.voltaje = voltaje; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public String getCampoAdicional() { return campoAdicional; }
    public void setCampoAdicional(String campoAdicional) { this.campoAdicional = campoAdicional; }
    
    public String getFirmaCliente() { return firmaCliente; }
    public void setFirmaCliente(String firmaCliente) { this.firmaCliente = firmaCliente; }
}