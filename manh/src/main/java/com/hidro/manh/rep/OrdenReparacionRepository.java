package com.hidro.manh.rep;

import com.hidro.manh.ety.OrdenReparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
    
    // Consulta corregida según estructura real de la base de datos
    @Query("SELECT or FROM OrdenReparacion or " +
           "JOIN or.motor m " +
           "JOIN m.ubicacion u " +
           "JOIN u.cliente c " +
           "WHERE c.idCliente = :clienteId")
    List<OrdenReparacion> findByMotorUbicacionClienteIdCliente(@Param("clienteId") Long clienteId);
    
    // Nuevos métodos para el frontend
    @Query("SELECT or FROM OrdenReparacion or " +
           "JOIN or.motor m " +
           "WHERE m.idMotor = :motorId")
    List<OrdenReparacion> findByMotorId(@Param("motorId") Long motorId);
    
    @Query("SELECT or FROM OrdenReparacion or WHERE or.fecha BETWEEN :inicio AND :fin")
    List<OrdenReparacion> findByRangoFechas(@Param("inicio") java.util.Date inicio, @Param("fin") java.util.Date fin);
}