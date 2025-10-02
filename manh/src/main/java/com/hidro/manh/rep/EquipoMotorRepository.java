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
    
    // MÉTODOS EXISTENTES
    List<EquipoMotor> findByUbicacionIdUbicacion(Long idUbicacion);
    List<EquipoMotor> findByEstado(String estado);
    
    // MÉTODO CORREGIDO - Consulta JPQL válida
    @Query("SELECT em FROM EquipoMotor em WHERE em.idMotor NOT IN " +
           "(SELECT om.motor.idMotor FROM OrdenMantenimiento om WHERE om.horaIngreso > :fechaLimite)")
    List<EquipoMotor> findEquiposSinMantencionReciente(@Param("fechaLimite") Date fechaLimite);
    
    // MÉTODO FALTANTE QUE CAUSA EL ERROR
    @Query("SELECT COUNT(em) FROM EquipoMotor em WHERE em.ubicacion.cliente.idCliente = :clienteId")
    Long countByUbicacionClienteIdCliente(@Param("clienteId") Long clienteId);
    
    // MÉTODOS ADICIONALES
    @Query("SELECT em FROM EquipoMotor em WHERE em.ubicacion.cliente.idCliente = :clienteId")
    List<EquipoMotor> findByClienteId(@Param("clienteId") Long clienteId);
    
    List<EquipoMotor> findByTipo(String tipo);
    List<EquipoMotor> findByMarca(String marca);
    
    @Query("SELECT em FROM EquipoMotor em WHERE em.fechaInstalacion < :fecha")
    List<EquipoMotor> findEquiposInstaladosAntesDe(@Param("fecha") Date fecha);
}