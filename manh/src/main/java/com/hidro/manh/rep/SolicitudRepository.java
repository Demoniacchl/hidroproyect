package com.hidro.manh.rep;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    // Agregar estos métodos a tu SolicitudRepository.java existente

List<Solicitud> findByEstado(String estado);
Long countByEstado(String estado);
}
