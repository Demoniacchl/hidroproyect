package com.hidro.manh.srs;

import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.enums.TipoEvento;

import com.hidro.manh.rep.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Date;
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
    private OrdenReparacionRepository ordenReparacionRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;
    
    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;
    
    @Autowired
    private CalendarioRepository calendarioRepository;
    @Service
public class DashboardService {
    
    @Autowired
    private SolicitudRepository solicitudRepository;
    
    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    // Métodos faltantes para el Dashboard
    public Long getTotalSolicitudes() {
        return solicitudRepository.count();
    }
    
    public Long getSolicitudesPendientes() {
        return solicitudRepository.countByEstado(EstadoSolicitud.PENDIENTE);
    }
    
    public Long getMantencionesEsteMes() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().length(LocalDateTime.now().toLocalDate().isLeapYear())).withHour(23).withMinute(59).withSecond(59);
        
        return ordenMantenimientoRepository.countByFechaBetween(
            Date.from(startOfMonth.atZone(ZoneId.systemDefault()).toInstant()),
            Date.from(endOfMonth.atZone(ZoneId.systemDefault()).toInstant())
        );
    }
    
    // Si necesitas métodos adicionales en el repository:
}
    // Método corregido para contar solicitudes por estado
    public List<Map<String, Object>> getSolicitudesPorEstado() {
        try {
            List<Map<String, Object>> resultados = solicitudRepository.countByEstadoSolicitud()
                .stream()
                .map(result -> {
                    Map<String, Object> map = new HashMap<>();
                    // Convertir el enum EstadoSolicitud a String
                    if (result.get("estado") instanceof Enum) {
                        map.put("estado", ((Enum<?>) result.get("estado")).name());
                    } else {
                        map.put("estado", result.get("estado").toString());
                    }
                    map.put("count", result.get("count"));
                    return map;
                })
                .collect(Collectors.toList());
            return resultados;
        } catch (Exception e) {
            // Fallback si hay problemas con la consulta
            return getSolicitudesPorEstadoFallback();
        }
    }
      public Long getTotalSolicitudes() {
        return solicitudRepository.count();
    }
    
    public Long getSolicitudesPendientes() {
        return solicitudRepository.countByEstado(EstadoSolicitud.PENDIENTE);
    }
    
    public Long getMantencionesEsteMes() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().length(LocalDateTime.now().toLocalDate().isLeapYear())).withHour(23).withMinute(59).withSecond(59);
        
        return ordenMantenimientoRepository.countByFechaBetween(
            Date.from(startOfMonth.atZone(ZoneId.systemDefault()).toInstant()),
            Date.from(endOfMonth.atZone(ZoneId.systemDefault()).toInstant())
        );
    }
    // Método fallback alternativo
    private List<Map<String, Object>> getSolicitudesPorEstadoFallback() {
        Map<String, Long> counts = solicitudRepository.findAll()
            .stream()
            .collect(Collectors.groupingBy(
                solicitud -> solicitud.getEstado().name(),
                Collectors.counting()
            ));
        
        return counts.entrySet()
            .stream()
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("estado", entry.getKey());
                map.put("count", entry.getValue());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    // Otros métodos del dashboard que también podrían tener problemas similares
    public List<Map<String, Object>> getEventosProximos() {
        return calendarioRepository.findByTipoEventoAndFechaInicioAfter(
                TipoEvento.MANTENCION, 
                LocalDateTime.now()
            )
            .stream()
            .map(evento -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", evento.getIdCalendario());
                map.put("titulo", evento.getTitulo());
                map.put("tipoEvento", evento.getTipoEvento().name()); // Convertir enum a String
                map.put("fechaInicio", evento.getFechaInicio());
                map.put("cliente", evento.getCliente().getNombre1());
                return map;
            })
            .collect(Collectors.toList());
    }
}