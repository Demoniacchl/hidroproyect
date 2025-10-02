package com.hidro.manh.dto;

import java.time.LocalDateTime;
import java.util.Date;

public class OrdenInicioDTO {
    private Long idEquipo;
    private Long idTecnico;
    private LocalDateTime horaIngreso;
    private String tipoOrden;
    
    public OrdenInicioDTO() {}
    
    public OrdenInicioDTO(Long idEquipo, Long idTecnico, LocalDateTime horaIngreso, String tipoOrden) {
        this.idEquipo = idEquipo;
        this.idTecnico = idTecnico;
        this.horaIngreso = horaIngreso;
        this.tipoOrden = tipoOrden;
    }
    public Date getHoraIngresoAsDate() {
    return java.sql.Timestamp.valueOf(this.horaIngreso);
}
    // Getters y Setters
    public Long getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Long idEquipo) { this.idEquipo = idEquipo; }
    
    public Long getIdTecnico() { return idTecnico; }
    public void setIdTecnico(Long idTecnico) { this.idTecnico = idTecnico; }
    
    public LocalDateTime getHoraIngreso() { return horaIngreso; }
    public void setHoraIngreso(LocalDateTime horaIngreso) { this.horaIngreso = horaIngreso; }
    
    public String getTipoOrden() { return tipoOrden; }
    public void setTipoOrden(String tipoOrden) { this.tipoOrden = tipoOrden; }
}