package com.hidro.manh.rep;

import com.hidro.manh.ety.OrdenReparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
    
    // MÉTODO CORREGIDO - Usando @Query explícita
    @Query("SELECT or FROM OrdenReparacion or WHERE or.motor.ubicacion.cliente.idCliente = :clienteId")
    List<OrdenReparacion> findByEquipoUbicacionClienteIdCliente(@Param("clienteId") Long clienteId);
    
    // MÉTODO CORREGIDO - Para contar
    @Query("SELECT COUNT(or) FROM OrdenReparacion or WHERE or.motor.ubicacion.cliente.idCliente = :clienteId")
    Long countByEquipoUbicacionClienteIdCliente(@Param("clienteId") Long clienteId);
    
    // MÉTODOS EXISTENTES
    List<OrdenReparacion> findByProgreso(String progreso);
    
    @Query("SELECT or FROM OrdenReparacion or WHERE or.tecnico.idUsuario = :tecnicoId")
    List<OrdenReparacion> findByTecnicoId(@Param("tecnicoId") Long tecnicoId);
    
    @Query("SELECT or FROM OrdenReparacion or WHERE or.motor.idMotor = :motorId ORDER BY or.fecha DESC")
    List<OrdenReparacion> findByMotorId(@Param("motorId") Long motorId);
    
    @Query("SELECT or FROM OrdenReparacion or WHERE or.fecha BETWEEN :startDate AND :endDate")
    List<OrdenReparacion> findByFechaBetween(@Param("startDate") java.util.Date startDate, @Param("endDate") java.util.Date endDate);
}