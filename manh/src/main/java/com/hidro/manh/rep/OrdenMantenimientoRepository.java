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
import java.util.Optional;

@Repository
public interface OrdenMantenimientoRepository extends JpaRepository<OrdenMantenimiento, Long> {
    
    // MÉTODOS EXISTENTES
    List<OrdenMantenimiento> findByHoraIngresoBetween(Date start, Date end);
    List<OrdenMantenimiento> findByMotor(EquipoMotor motor);
    List<OrdenMantenimiento> findByTecnico(Usuario tecnico);
    
    // MÉTODO CORREGIDO - usar horaIngreso en lugar de fecha
    @Query("SELECT o FROM OrdenMantenimiento o ORDER BY o.horaIngreso DESC LIMIT 5")
    List<OrdenMantenimiento> findTop5ByOrderByHoraIngresoDesc();
    
    // MÉTODO CORREGIDO - contar por horaIngreso en lugar de fecha
    @Query("SELECT COUNT(o) FROM OrdenMantenimiento o WHERE o.horaIngreso BETWEEN :start AND :end")
    Long countByHoraIngresoBetween(@Param("start") Date start, @Param("end") Date end);

    // MÉTODOS FALTANTES PARA ReporteService
    
    // Contar órdenes por cliente (a través de motor -> ubicacion -> cliente)
    @Query("SELECT COUNT(o) FROM OrdenMantenimiento o WHERE o.motor.ubicacion.cliente.idCliente = :clienteId")
    Long countByIdMotorUbicacionClienteIdCliente(@Param("clienteId") Long clienteId);
    
    // Contar órdenes por técnico
    @Query("SELECT COUNT(o) FROM OrdenMantenimiento o WHERE o.tecnico.idUsuario = :tecnicoId")
    Long countByIdTecnicoIdUsuario(@Param("tecnicoId") Long tecnicoId);
    
    // Contar órdenes por técnico y rango de fechas
    @Query("SELECT COUNT(o) FROM OrdenMantenimiento o WHERE o.tecnico.idUsuario = :tecnicoId AND o.horaIngreso BETWEEN :start AND :end")
    Long countByIdTecnicoIdUsuarioAndHoraIngresoBetween(@Param("tecnicoId") Long tecnicoId, @Param("start") Date start, @Param("end") Date end);
    
    // Contar órdenes por motor
    @Query("SELECT COUNT(o) FROM OrdenMantenimiento o WHERE o.motor.idMotor = :motorId")
    Long countByIdMotorIdMotor(@Param("motorId") Long motorId);
    
    // Obtener la última orden por motor
    @Query("SELECT o FROM OrdenMantenimiento o WHERE o.motor.idMotor = :motorId ORDER BY o.horaIngreso DESC LIMIT 1")
    Optional<OrdenMantenimiento> findTopByIdMotorIdMotorOrderByHoraIngresoDesc(@Param("motorId") Long motorId);
    
    // MÉTODOS ADICIONALES QUE PODRÍAN SER ÚTILES
    
    // Órdenes por cliente
    @Query("SELECT o FROM OrdenMantenimiento o WHERE o.motor.ubicacion.cliente.idCliente = :clienteId ORDER BY o.horaIngreso DESC")
    List<OrdenMantenimiento> findByClienteId(@Param("clienteId") Long clienteId);
    
    // Órdenes por técnico
    @Query("SELECT o FROM OrdenMantenimiento o WHERE o.tecnico.idUsuario = :tecnicoId ORDER BY o.horaIngreso DESC")
    List<OrdenMantenimiento> findByTecnicoId(@Param("tecnicoId") Long tecnicoId);
    
    // Órdenes por estado de checklist (ejemplo: donde se cambió rodamientos)
    @Query("SELECT o FROM OrdenMantenimiento o WHERE o.cambioRodamientos = 'SI' ORDER BY o.horaIngreso DESC")
    List<OrdenMantenimiento> findWhereCambioRodamientos();
    
    // Estadísticas mensuales
    @Query("SELECT MONTH(o.horaIngreso) as mes, COUNT(o) as total FROM OrdenMantenimiento o WHERE YEAR(o.horaIngreso) = :year GROUP BY MONTH(o.horaIngreso)")
    List<Object[]> countByMonth(@Param("year") int year);
}