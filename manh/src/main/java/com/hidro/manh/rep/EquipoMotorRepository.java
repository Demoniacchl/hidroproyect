package com.hidro.manh.rep;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.EquipoMotor;

public interface EquipoMotorRepository extends JpaRepository<EquipoMotor, Long> {
    // Agregar estos métodos a tu EquipoMotorRepository.java existente

Long countByUbicacionClienteIdCliente(Long clienteId);
List<Object[]> findEquiposSinMantencionReciente(LocalDateTime fechaLimite);
}
