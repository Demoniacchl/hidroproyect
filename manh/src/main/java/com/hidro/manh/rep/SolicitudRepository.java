package com.hidro.manh.rep;

import com.hidro.manh.ety.Solicitud;
import com.hidro.manh.enums.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
    // MÉTODO FALTANTE
    Long countByEstado(EstadoSolicitud estado);
    
    // MÉTODO CORREGIDO - USANDO PROYECCIÓN
    @Query("SELECT s.estado as estado, COUNT(s) as count FROM Solicitud s GROUP BY s.estado")
    List<EstadoCountProjection> countSolicitudesByEstado();
    
    interface EstadoCountProjection {
        EstadoSolicitud getEstado();
        Long getCount();
    }
    
    // MÉTODOS EXISTENTES
    List<Solicitud> findByEstado(EstadoSolicitud estado);
}