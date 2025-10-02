package com.hidro.manh.rep;

import com.hidro.manh.ety.EquipoMotor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EquipoMotorRepository extends JpaRepository<EquipoMotor, Long> {
    
    List<EquipoMotor> findByUbicacionIdUbicacion(Long idUbicacion);
    
    // CORREGIDO: ubicacion.cliente.idCliente
    Long countByUbicacionClienteIdCliente(Long clienteId);
    
    List<EquipoMotor> findByUbicacionClienteIdCliente(Long clienteId);
    
    // CORREGIDO: Query con nombres exactos
    @Query("SELECT em FROM EquipoMotor em WHERE em.idMotor NOT IN " +
           "(SELECT om.idMotor.idMotor FROM OrdenMantenimiento om WHERE om.horaIngreso > :fechaLimite)")
    List<EquipoMotor> findEquiposSinMantencionReciente(@Param("fechaLimite") Date fechaLimite);
}