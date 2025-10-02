package com.hidro.manh.rep;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.OrdenReparacion;

public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
// Agregar estos métodos al repository existente:
List<OrdenReparacion> findByEquipoUbicacionClienteIdCliente(Long clienteId);
List<OrdenReparacion> findByIdMotorUbicacionClienteIdCliente(Long clienteId);
List<OrdenReparacion> findByIdMotorUbicacionClienteIdClienteAndFechaAfter(Long clienteId, Date fecha);
List<OrdenReparacion> findByProgreso(String progreso);
List<OrdenReparacion> findByFechaAfter(Date fecha);
Long countByFechaBetween(Date inicio, Date fin);
}
