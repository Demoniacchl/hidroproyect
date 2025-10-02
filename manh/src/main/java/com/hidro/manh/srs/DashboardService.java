package com.hidro.manh.srs;

import com.hidro.manh.dto.DashboardEstadisticasDTO;
import com.hidro.manh.dto.AlertaDTO;
import com.hidro.manh.ety.*;
import com.hidro.manh.rep.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EquipoMotorRepository equipoMotorRepository;

    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    @Autowired
    private OrdenReparacionRepository ordenReparacionRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private CalendarioRepository calendarioRepository;

    public DashboardEstadisticasDTO getEstadisticas() {
        DashboardEstadisticasDTO estadisticas = new DashboardEstadisticasDTO();
        
        // Estadísticas básicas
        estadisticas.setTotalClientes(clienteRepository.count());
        estadisticas.setTotalEquipos(equipoMotorRepository.count());
        
        // Convertir LocalDateTime a Date para las consultas
        java.util.Date inicioMes = java.sql.Timestamp.valueOf(LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0));
        java.util.Date finMes = java.sql.Timestamp.valueOf(LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().maxLength()).withHour(23).withMinute(59).withSecond(59));
        
        // Mantenciones y reparaciones este mes
        Long mantencionesMes = ordenMantenimientoRepository.countByHoraIngresoBetween(inicioMes, finMes);
        Long reparacionesMes = ordenReparacionRepository.countByFechaBetween(inicioMes, finMes);
        
        estadisticas.setMantencionesEsteMes(mantencionesMes);
        estadisticas.setReparacionesEsteMes(reparacionesMes);
        
        // Solicitudes pendientes
        Long solicitudesPendientes = solicitudRepository.countByEstado("PENDIENTE");
        estadisticas.setSolicitudesPendientes(solicitudesPendientes);
        
        // Alertas activas (próximos eventos no notificados)
        Long alertasActivas = calendarioRepository.countByNotificadoFalseAndFechaInicioAfter(LocalDateTime.now());
        estadisticas.setAlertasActivas(alertasActivas);
        
        return estadisticas;
    }

    public List<AlertaDTO> getAlertas() {
        List<AlertaDTO> alertas = new ArrayList<>();
        
        // Alertas de eventos próximos (24 horas)
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en24Horas = ahora.plusHours(24);
        
        List<Calendario> eventosProximos = calendarioRepository.findByNotificadoFalseAndFechaInicioBetween(ahora, en24Horas);
        
        for (Calendario evento : eventosProximos) {
            AlertaDTO alerta = new AlertaDTO();
            alerta.setTipo("EVENTO_PROXIMO");
            alerta.setTitulo("Evento Programado: " + evento.getTipoEvento());
            alerta.setDescripcion(evento.getTitulo() + " - " + evento.getDescripcion());
            alerta.setIdCliente(evento.getCliente().getIdCliente());
            alerta.setNombreCliente(evento.getCliente().getNombre1());
            alerta.setFechaGeneracion(LocalDateTime.now());
            alerta.setLeida(false);
            
            if (evento.getEquipo() != null) {
                alerta.setIdEquipo(evento.getEquipo().getIdMotor());
                alerta.setNombreEquipo(evento.getEquipo().getMarca() + " " + evento.getEquipo().getModelo());
            }
            
            alertas.add(alerta);
        }
        
        return alertas;
    }

    public List<Map<String, Object>> getProximasMantenciones() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Calendario> proximasMantenciones = calendarioRepository.findByTipoEventoAndFechaInicioAfter(
            com.hidro.manh.enums.TipoEvento.MANTENCION, ahora);
        
        return proximasMantenciones.stream()
                .map(evento -> {
                    Map<String, Object> mapa = new HashMap<>();
                    mapa.put("id", evento.getIdCalendario());
                    mapa.put("titulo", evento.getTitulo());
                    mapa.put("cliente", evento.getCliente().getNombre1());
                    mapa.put("fecha", evento.getFechaInicio());
                    mapa.put("tecnico", evento.getTecnico() != null ? evento.getTecnico().getNombre() : "Sin asignar");
                    return mapa;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getOrdenesPendientes() {
        List<OrdenMantenimiento> ordenesPendientes = ordenMantenimientoRepository.findByHoraSalidaIsNull();
        
        return ordenesPendientes.stream()
                .map(orden -> {
                    Map<String, Object> mapa = new HashMap<>();
                    mapa.put("id", orden.getIdOrden());
                    
                    // Usar getIdMotor() en lugar de getEquipo()
                    if (orden.getMotor() != null) {
                        mapa.put("equipo", orden.getMotor().getMarca() + " " + orden.getMotor().getModelo());
                        if (orden.getMotor().getUbicacion() != null && orden.getMotor().getUbicacion().getCliente() != null) {
                            mapa.put("cliente", orden.getMotor().getUbicacion().getCliente().getNombre1());
                        }
                    }
                    
                    if (orden.getIdTecnico() != null) {
                        mapa.put("tecnico", orden.getIdTecnico().getNombre());
                    }
                    
                    mapa.put("horaIngreso", orden.getHoraIngreso());
                    
                    return mapa;
                })
                .collect(Collectors.toList());
    }
}