package com.hidro.manh.rep;


import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hidro.manh.ety.EquipoMotor;

public interface EquipoMotorRepository extends JpaRepository<EquipoMotor, Long> {
Long countByUbicacionClienteIdCliente(Long clienteId);

@Query("SELECT em FROM EquipoMotor em WHERE em.idMotor NOT IN " +
       "(SELECT om.idMotor.idMotor FROM OrdenMantenimiento om WHERE om.horaIngreso > :fechaLimite)")
List<Object[]> findEquiposSinMantencionReciente(@Param("fechaLimite") Date fechaLimite);
}
