package com.hidro.manh.dto;

public class DashboardEstadisticasDTO {
    private Long totalClientes;
    private Long totalEquipos;
    private Long mantencionesEsteMes;
    private Long reparacionesEsteMes;
    private Long solicitudesPendientes;
    private Long alertasActivas;
    
    public DashboardEstadisticasDTO() {}
    
    // Getters y Setters
    public Long getTotalClientes() { return totalClientes; }
    public void setTotalClientes(Long totalClientes) { this.totalClientes = totalClientes; }
    
    public Long getTotalEquipos() { return totalEquipos; }
    public void setTotalEquipos(Long totalEquipos) { this.totalEquipos = totalEquipos; }
    
    public Long getMantencionesEsteMes() { return mantencionesEsteMes; }
    public void setMantencionesEsteMes(Long mantencionesEsteMes) { this.mantencionesEsteMes = mantencionesEsteMes; }
    
    public Long getReparacionesEsteMes() { return reparacionesEsteMes; }
    public void setReparacionesEsteMes(Long reparacionesEsteMes) { this.reparacionesEsteMes = reparacionesEsteMes; }
    
    public Long getSolicitudesPendientes() { return solicitudesPendientes; }
    public void setSolicitudesPendientes(Long solicitudesPendientes) { this.solicitudesPendientes = solicitudesPendientes; }
    
    public Long getAlertasActivas() { return alertasActivas; }
    public void setAlertasActivas(Long alertasActivas) { this.alertasActivas = alertasActivas; }
}