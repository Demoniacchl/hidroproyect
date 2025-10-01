package com.hidro.manh.rep;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.OrdenReparacion;

public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
    // Agregar estos métodos a tu OrdenReparacionRepository.java existente

List<OrdenReparacion> findByEquipoUbicacionClienteIdCliente(Long clienteId);
List<OrdenReparacion> findByEquipoUbicacionClienteIdClienteAndFechaAfter(Long clienteId, LocalDateTime fecha);
List<OrdenReparacion> findByProgreso(String progreso);
List<OrdenReparacion> findByFechaAfter(LocalDateTime fecha);
Long countByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}
