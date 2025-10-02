package com.hidro.manh.srs;

import com.hidro.manh.ety.Solicitud;
import com.hidro.manh.enums.EstadoSolicitud;
import com.hidro.manh.rep.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    // MÉTODO FALTANTE CORREGIDO
    public Optional<Solicitud> findById(Long id) {
        return solicitudRepository.findById(id);
    }
    
    // MÉTODO CORREGIDO - USANDO ENUM DIRECTAMENTE
    public Solicitud actualizarEstado(Long id, EstadoSolicitud estado) {
        Solicitud solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        solicitud.setEstado(estado);
        return solicitudRepository.save(solicitud);
    }
    
    // MÉTODO PARA CONVERTIR STRING A ENUM
    public Solicitud actualizarEstadoFromString(Long id, String estadoStr) {
        EstadoSolicitud estado;
        try {
            estado = EstadoSolicitud.valueOf(estadoStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Valor de estado inválido: " + estadoStr);
        }
        return actualizarEstado(id, estado);
    }

    // MÉTODOS EXISTENTES
    public List<Solicitud> findAll() {
        return solicitudRepository.findAll();
    }
    
    public Solicitud save(Solicitud solicitud) {
        return solicitudRepository.save(solicitud);
    }
    
    public void deleteById(Long id) {
        solicitudRepository.deleteById(id);
    }
    
    public List<Solicitud> findByEstado(EstadoSolicitud estado) {
        return solicitudRepository.findByEstado(estado);
    }
}