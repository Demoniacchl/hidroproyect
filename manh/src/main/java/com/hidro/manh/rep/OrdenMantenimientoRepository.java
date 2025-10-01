package com.hidro.manh.rep;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.OrdenMantenimiento;

public interface OrdenMantenimientoRepository extends JpaRepository<OrdenMantenimiento, Long> {

    // Agregar estos métodos a tu OrdenMantenimientoRepository.java existente

Optional<OrdenMantenimiento> findTopByEquipoUbicacionClienteIdClienteOrderByHoraIngresoDesc(Long clienteId);
List<OrdenMantenimiento> findByTecnicoIdUsuario(Long tecnicoId);
List<OrdenMantenimiento> findByHoraSalidaIsNull();
Long countByHoraIngresoBetween(LocalDateTime inicio, LocalDateTime fin);
Long countByEquipoUbicacionClienteIdCliente(Long clienteId);
Long countByTecnicoIdUsuario(Long tecnicoId);
Long countByTecnicoIdUsuarioAndHoraIngresoBetween(Long tecnicoId, LocalDateTime inicio, LocalDateTime fin);
Optional<OrdenMantenimiento> findTopByEquipoIdMotorOrderByHoraIngresoDesc(Long equipoId);
Long countByEquipoIdMotor(Long equipoId);

}
