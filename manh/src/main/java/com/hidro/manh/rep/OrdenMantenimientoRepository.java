package com.hidro.manh.rep;


import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.OrdenMantenimiento;

public interface OrdenMantenimientoRepository extends JpaRepository<OrdenMantenimiento, Long> {



Optional<OrdenMantenimiento> findTopByIdMotorUbicacionClienteIdClienteOrderByHoraIngresoDesc(Long clienteId);
Long countByIdMotorUbicacionClienteIdCliente(Long clienteId);
List<OrdenMantenimiento> findByIdTecnicoIdUsuario(Long tecnicoId);
List<OrdenMantenimiento> findByHoraSalidaIsNull();
Long countByHoraIngresoBetween(Date inicio, Date fin);
Long countByIdMotorUbicacionIdCliente(Long clienteId);
Long countByIdTecnicoIdUsuario(Long tecnicoId);
List<OrdenMantenimiento> findByHoraIngresoBetween(Date start, Date end);
Long countByIdTecnicoIdUsuarioAndHoraIngresoBetween(Long tecnicoId, Date inicio, Date fin);
Optional<OrdenMantenimiento> findTopByIdMotorIdMotorOrderByHoraIngresoDesc(Long equipoId);
Long countByIdMotorIdMotor(Long equipoId);
Long countByFechaBetween(Date start, Date end);

}
