package com.hidro.manh.rep;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.ety.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    // Agregar estos métodos a tu SolicitudRepository.java existente

List<Solicitud> findByEstado(String estado);
Long countByEstado(String estado);

    @Query("SELECT new map(s.estado as estado, COUNT(s) as count) FROM Solicitud s GROUP BY s.estado")
    List<Map<String, Object>> countByEstadoSolicitud();
    
    // O si prefieres usar una proyección con interfaz:
    @Query("SELECT s.estado as estado, COUNT(s) as count FROM Solicitud s GROUP BY s.estado")
    List<EstadoCountProjection> countSolicitudesByEstado();
    
    // Interfaz para la proyección
    interface EstadoCountProjection {
        EstadoSolicitud getEstado();
        Long getCount();
    }
}
