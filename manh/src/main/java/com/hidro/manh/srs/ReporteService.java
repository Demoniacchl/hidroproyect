package com.hidro.manh.srs;

import com.hidro.manh.ety.*;
import com.hidro.manh.enums.RolUsuario;
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
        // Convertir LocalDateTime a Date - CORREGIDO
        java.util.Date inicio = java.sql.Timestamp.valueOf(fechaInicio);
        java.util.Date fin = java.sql.Timestamp.valueOf(fechaFin);
        
        List<OrdenMantenimiento> mantenciones = ordenMantenimientoRepository.findByHoraIngresoBetween(inicio, fin);
        
        return mantenciones.stream()
                .map(mantencion -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", mantencion.getIdOrden());
                    reporteItem.put("fecha", mantencion.getHoraIngreso());
                    reporteItem.put("tipo", "MANTENCION");
                    
                    // CORREGIDO: Usar getIdMotor() correctamente
                    if (mantencion.getMotor() != null) {
                        reporteItem.put("equipo", mantencion.getMotor().getMarca() + " " + mantencion.getMotor().getModelo());
                        if (mantencion.getMotor().getUbicacion() != null && mantencion.getMotor().getUbicacion().getCliente() != null) {
                            reporteItem.put("cliente", mantencion.getMotor().getUbicacion().getCliente().getNombre1());
                        }
                    }
                    
                    if (mantencion.getTecnico() != null) {
                        reporteItem.put("tecnico", mantencion.getTecnico().getNombre());
                    }
                    
                    // Calcular duración - CORREGIDO
                    if (mantencion.getHoraSalida() != null) {
                        Duration duracion = Duration.between(
                            mantencion.getHoraIngreso().toInstant(), 
                            mantencion.getHoraSalida().toInstant()
                        );
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
                    reporteItem.put("nCliente", cliente.getN_cliente());
                    reporteItem.put("nombre", cliente.getNombre1());
                    reporteItem.put("contacto", cliente.getTelefono1());
                    reporteItem.put("correo", cliente.getCorreo());
                    
                    // Estadísticas del cliente - CORREGIDAS
                    Long totalEquipos = equipoMotorRepository.countByUbicacionClienteIdCliente(cliente.getIdCliente());
                    Long totalMantenciones = ordenMantenimientoRepository.countByIdMotorUbicacionClienteIdCliente(cliente.getIdCliente());
                    
                    reporteItem.put("totalEquipos", totalEquipos);
                    reporteItem.put("totalMantenciones", totalMantenciones);
                    
                    return reporteItem;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> generarReporteTecnicos() {
        // Buscar técnicos por rol - CORREGIDO
        List<Usuario> tecnicos = usuarioRepository.findByRol(RolUsuario.TECNICO);
        
        return tecnicos.stream()
                .map(tecnico -> {
                    Map<String, Object> reporteItem = new HashMap<>();
                    reporteItem.put("id", tecnico.getIdUsuario());
                    reporteItem.put("nombre", tecnico.getNombre());
                    reporteItem.put("usuario", tecnico.getUsuario());
                    
                    // Estadísticas del técnico - CORREGIDAS
                    Long totalMantenciones = ordenMantenimientoRepository.countByIdTecnicoIdUsuario(tecnico.getIdUsuario());
                    
                    // Mantenciones este mes - CORREGIDAS
                    java.util.Date inicioMes = java.sql.Timestamp.valueOf(LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0));
                    java.util.Date finMes = java.sql.Timestamp.valueOf(LocalDateTime.now().withDayOfMonth(LocalDateTime.now().getMonth().maxLength()).withHour(23).withMinute(59).withSecond(59));
                    
                    Long mantencionesEsteMes = ordenMantenimientoRepository.countByIdTecnicoIdUsuarioAndHoraIngresoBetween(
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
                    
                    // Estadísticas del equipo - CORREGIDAS
                    Long totalMantenciones = ordenMantenimientoRepository.countByIdMotorIdMotor(equipo.getIdMotor());
                    reporteItem.put("totalMantenciones", totalMantenciones);
                    
                    // Última mantención - CORREGIDA
                    ordenMantenimientoRepository
                        .findTopByIdMotorIdMotorOrderByHoraIngresoDesc(equipo.getIdMotor())
                        .ifPresentOrElse(
                            ultimaMantencion -> {
                                reporteItem.put("ultimaMantencion", ultimaMantencion.getHoraIngreso());
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