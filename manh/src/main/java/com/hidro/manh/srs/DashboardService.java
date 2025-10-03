package com.hidro.manh.srs;

import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.rep.SolicitudRepository;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.rep.CalendarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    
    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;
    
    @Autowired
    private CalendarioRepository calendarioRepository;

    // MÉTODOS FALTANTES CORREGIDOS
    public Long getTotalSolicitudes() {
        return solicitudRepository.count();
    }
    
    public Long getSolicitudesPendientes() {
        return solicitudRepository.countByEstado(EstadoSolicitud.PENDIENTE);
    }
    


    // MÉTODOS EXISTENTES CORREGIDOS
    public List<Map<String, Object>> getSolicitudesPorEstado() {
        List<SolicitudRepository.EstadoCountProjection> results = solicitudRepository.countSolicitudesByEstado();
        return results.stream()
            .map(result -> {
                Map<String, Object> map = new HashMap<>();
                map.put("estado", result.getEstado().name());
                map.put("count", result.getCount());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getEventosProximos() {
        return calendarioRepository.findByTipoEventoAndFechaInicioAfter(TipoEvento.MANTENCION, LocalDateTime.now())
            .stream()
            .map(evento -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", evento.getIdCalendario());
                map.put("titulo", evento.getTitulo());
                map.put("tipoEvento", evento.getTipoEvento().name());
                map.put("fechaInicio", evento.getFechaInicio());
                map.put("cliente", evento.getCliente().getNombre1());
                return map;
            })
            .collect(Collectors.toList());
    }
    

}