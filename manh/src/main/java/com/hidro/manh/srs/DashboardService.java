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
import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.ety.Solicitud;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.rep.CalendarioRepository;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.rep.OrdenReparacionRepository;
import com.hidro.manh.rep.SolicitudRepository;
import com.hidro.manh.rep.UsuarioRepository;

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
        equipoMotorRepository.countByUbicacionClienteIdCliente(clienteId)
        ordenMantenimientoRepository.countByIdMotorUbicacionClienteIdCliente(clienteId)
        // Mantenciones y reparaciones este mes
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().maxLength()).withHour(23).withMinute(59).withSecond(59);
        
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
        
        // Alertas de equipos inactivos (sin mantenciones en 30 días)
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        List<Object[]> equiposInactivos = equipoMotorRepository.findEquiposSinMantencionReciente(hace30Dias);
        
        for (Object[] resultado : equiposInactivos) {
            EquipoMotor equipo = (EquipoMotor) resultado[0];
            AlertaDTO alerta = new AlertaDTO();
            alerta.setTipo("EQUIPO_INACTIVO");
            alerta.setTitulo("Equipo Sin Mantención Reciente");
            alerta.setDescripcion("El equipo " + equipo.getMarca() + " " + equipo.getModelo() + " no tiene mantenciones en los últimos 30 días");
            alerta.setIdCliente(equipo.getUbicacion().getCliente().getIdCliente());
            alerta.setNombreCliente(equipo.getUbicacion().getCliente().getNombre1());
            alerta.setIdEquipo(equipo.getIdMotor());
            alerta.setNombreEquipo(equipo.getMarca() + " " + equipo.getModelo());
            alerta.setFechaGeneracion(LocalDateTime.now());
            alerta.setLeida(false);
            
            alertas.add(alerta);
        }
        
        return alertas;
    }

    public List<Object> getProximasMantenciones() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Calendario> proximasMantenciones = calendarioRepository.findProximasMantenciones(ahora);
        
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

    public List<Object> getOrdenesPendientes() {
        List<OrdenMantenimiento> ordenesPendientes = ordenMantenimientoRepository.findByHoraSalidaIsNull();
        
        return ordenesPendientes.stream()
                .map(orden -> {
                    Map<String, Object> mapa = new HashMap<>();
                    mapa.put("id", orden.getIdOrden());
                    mapa.put("equipo", orden.getEquipo().getMarca() + " " + orden.getEquipo().getModelo());
                    mapa.put("cliente", orden.getEquipo().getUbicacion().getCliente().getNombre1());
                    mapa.put("tecnico", orden.getTecnico().getNombre());
                    mapa.put("horaIngreso", orden.getHoraIngreso());
                    return mapa;
                })
                .collect(Collectors.toList());
    }
}