// srs/ReporteService.java - VERSIÓN CORREGIDA
package com.hidro.manh.srs;

import com.hidro.manh.ety.*;
import com.hidro.manh.rep.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EquipoMotorRepository equipoMotorRepository;

    public List<Map<String, Object>> generarReporteMantenciones(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<OrdenMantenimiento> mantenciones = ordenMantenimientoRepository.findByHoraIngresoBetween(fechaInicio, fechaFin);
        
        return mantenciones.stream()
                .map(mantencion -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", mantencion.getIdOrden());
                    reporteItem.put("fecha", mantencion.getHoraIngreso().toLocalDate());
                    reporteItem.put("cliente", mantencion.getEquipo().getUbicacion().getCliente().getNombre1());
                    reporteItem.put("equipo", mantencion.getEquipo().getMarca() + " " + mantencion.getEquipo().getModelo());
                    reporteItem.put("tecnico", mantencion.getTecnico().getNombre());
                    reporteItem.put("tipo", "MANTENCION");
                    
                    // Calcular duración
                    if (mantencion.getHoraSalida() != null) {
                        Duration duracion = Duration.between(mantencion.getHoraIngreso(), mantencion.getHoraSalida());
                        reporteItem.put("duracion", duracion.toHours() + " horas");
                    } else {
                        reporteItem.put("duracion", "En progreso");
                    }
                    
                    return reporteItem;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> generarReporteClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        
        return clientes.stream()
                .map(cliente -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", cliente.getIdCliente());
                    reporteItem.put("nCliente", cliente.getNCliente());
                    reporteItem.put("nombre", cliente.getNombre1());
                    reporteItem.put("contacto", cliente.getTelefono1());
                    reporteItem.put("correo", cliente.getCorreo());
                    
                    // Estadísticas del cliente
                    Long totalEquipos = equipoMotorRepository.countByUbicacionClienteIdCliente(cliente.getIdCliente());
                    Long totalMantenciones = ordenMantenimientoRepository.countByEquipoUbicacionClienteIdCliente(cliente.getIdCliente());
                    
                    reporteItem.put("totalEquipos", totalEquipos);
                    reporteItem.put("totalMantenciones", totalMantenciones);
                    
                    return reporteItem;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> generarReporteTecnicos() {
        // Buscar técnicos por rol
        List<Usuario> tecnicos = usuarioRepository.findByRol(com.hidro.manh.enums.RolUsuario.TECNICO);
        
        return tecnicos.stream()
                .map(tecnico -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", tecnico.getIdUsuario());
                    reporteItem.put("nombre", tecnico.getNombre());
                    reporteItem.put("usuario", tecnico.getUsuario());
                    
                    // Estadísticas del técnico
                    Long totalMantenciones = ordenMantenimientoRepository.countByTecnicoIdUsuario(tecnico.getIdUsuario());
                    
                    // Mantenciones este mes
                    LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime finMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().maxLength()).withHour(23).withMinute(59).withSecond(59);
                    
                    Long mantencionesEsteMes = ordenMantenimientoRepository.countByTecnicoIdUsuarioAndHoraIngresoBetween(
                        tecnico.getIdUsuario(), inicioMes, finMes);
                    
                    reporteItem.put("totalMantenciones", totalMantenciones);
                    reporteItem.put("mantencionesEsteMes", mantencionesEsteMes);
                    reporteItem.put("activo", true);
                    
                    return reporteItem;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> generarReporteEquipos() {
        List<EquipoMotor> equipos = equipoMotorRepository.findAll();
        
        return equipos.stream()
                .map(equipo -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", equipo.getIdMotor());
                    reporteItem.put("marca", equipo.getMarca());
                    reporteItem.put("modelo", equipo.getModelo());
                    reporteItem.put("tipo", equipo.getTipo());
                    reporteItem.put("ubicacion", equipo.getUbicacion().getNombre());
                    reporteItem.put("cliente", equipo.getUbicacion().getCliente().getNombre1());
                    reporteItem.put("estado", equipo.getEstado());
                    
                    // Estadísticas del equipo
                    Long totalMantenciones = ordenMantenimientoRepository.countByEquipoIdMotor(equipo.getIdMotor());
                    reporteItem.put("totalMantenciones", totalMantenciones);
                    
                    // Última mantención
                    ordenMantenimientoRepository
                        .findTopByEquipoIdMotorOrderByHoraIngresoDesc(equipo.getIdMotor())
                        .ifPresentOrElse(
                            ultimaMantencion -> {
                                reporteItem.put("ultimaMantencion", ultimaMantencion.getHoraIngreso().toLocalDate());
                            },
                            () -> {
                                reporteItem.put("ultimaMantencion", "Nunca");
                            }
                        );
                    
                    return reporteItem;
                })
                .collect(Collectors.toList());
    }
}