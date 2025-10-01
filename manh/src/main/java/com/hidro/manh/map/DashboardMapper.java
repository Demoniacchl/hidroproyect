package com.hidro.manh.map;

import com.hidro.manh.dto.DashboardEstadisticasDTO;
import com.hidro.manh.dto.AlertaDTO;
import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.OrdenMantenimiento;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DashboardMapper {

    public DashboardEstadisticasDTO toDashboardEstadisticasDTO(
            Long totalClientes, 
            Long totalEquipos, 
            Long mantencionesEsteMes, 
            Long reparacionesEsteMes, 
            Long solicitudesPendientes, 
            Long alertasActivas) {
        
        DashboardEstadisticasDTO dto = new DashboardEstadisticasDTO();
        dto.setTotalClientes(totalClientes);
        dto.setTotalEquipos(totalEquipos);
        dto.setMantencionesEsteMes(mantencionesEsteMes);
        dto.setReparacionesEsteMes(reparacionesEsteMes);
        dto.setSolicitudesPendientes(solicitudesPendientes);
        dto.setAlertasActivas(alertasActivas);
        
        return dto;
    }

    public AlertaDTO toAlertaDTOFromCalendario(Calendario calendario) {
        AlertaDTO alerta = new AlertaDTO();
        alerta.setTipo("EVENTO_PROXIMO");
        alerta.setTitulo("Evento Programado: " + calendario.getTipoEvento());
        alerta.setDescripcion(calendario.getTitulo() + " - " + calendario.getDescripcion());
        alerta.setIdCliente(calendario.getCliente().getIdCliente());
        alerta.setNombreCliente(calendario.getCliente().getNombre1());
        
        if (calendario.getEquipo() != null) {
            alerta.setIdEquipo(calendario.getEquipo().getIdMotor());
            alerta.setNombreEquipo(calendario.getEquipo().getMarca() + " " + calendario.getEquipo().getModelo());
        }
        
        alerta.setFechaGeneracion(java.time.LocalDateTime.now());
        alerta.setLeida(false);
        
        return alerta;
    }

    public Map<String, Object> toProximaMantencionMap(Calendario calendario) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("id", calendario.getIdCalendario());
        mapa.put("titulo", calendario.getTitulo());
        mapa.put("cliente", calendario.getCliente().getNombre1());
        mapa.put("fecha", calendario.getFechaInicio());
        mapa.put("tecnico", calendario.getTecnico() != null ? calendario.getTecnico().getNombre() : "Sin asignar");
        mapa.put("tipoEvento", calendario.getTipoEvento());
        
        return mapa;
    }

    public Map<String, Object> toOrdenPendienteMap(OrdenMantenimiento orden) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("id", orden.getIdOrden());
        mapa.put("equipo", orden.getEquipo().getMarca() + " " + orden.getEquipo().getModelo());
        mapa.put("cliente", orden.getEquipo().getUbicacion().getCliente().getNombre1());
        mapa.put("tecnico", orden.getTecnico().getNombre());
        mapa.put("horaIngreso", orden.getHoraIngreso());
        mapa.put("ubicacion", orden.getEquipo().getUbicacion().getNombre());
        
        return mapa;
    }
}