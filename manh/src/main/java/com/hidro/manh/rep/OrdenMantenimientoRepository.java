package com.hidro.manh.rep;

import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrdenMantenimientoRepository extends JpaRepository<OrdenMantenimiento, Long> {
    
    // MÉTODOS EXISTENTES
    List<OrdenMantenimiento> findByHoraIngresoBetween(Date start, Date end);
    List<OrdenMantenimiento> findByMotor(EquipoMotor motor);
    List<OrdenMantenimiento> findByTecnico(Usuario tecnico);
    
    // NUEVOS MÉTODOS PARA EL FRONTEND
    List<OrdenMantenimiento> findByMotorIdMotor(Long motorId);
    
    @Query("SELECT om FROM OrdenMantenimiento om WHERE om.horaIngreso BETWEEN :inicio AND :fin")
    List<OrdenMantenimiento> findByRangoFechas(@Param("inicio") Date inicio, @Param("fin") Date fin);
    
    // Búsqueda por cliente
    @Query("SELECT om FROM OrdenMantenimiento om " +
           "JOIN om.motor m " +
           "JOIN m.ubicacion u " +
           "JOIN u.cliente c " +
           "WHERE c.idCliente = :clienteId")
    List<OrdenMantenimiento> findByClienteId(@Param("clienteId") Long clienteId);
}