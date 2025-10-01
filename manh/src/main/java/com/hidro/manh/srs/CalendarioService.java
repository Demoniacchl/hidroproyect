// srs/CalendarioService.java
package com.hidro.manh.srs;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.dto.CalendarioDTO;
import com.hidro.manh.dto.CreateCalendarioDTO;
import com.hidro.manh.dto.UpdateCalendarioDTO;
import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.enums.EstadoEvento;
import com.hidro.manh.map.CalendarioMapper;
import com.hidro.manh.rep.CalendarioRepository;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CalendarioService {
    
    @Autowired
    private CalendarioRepository calendarioRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private EquipoMotorRepository equipoMotorRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;
    
    @Autowired
    private CalendarioMapper calendarioMapper;

    // ========== MÉTODOS CRUD BÁSICOS ==========
    
    public List<Calendario> findAll() {
        return calendarioRepository.findAll();
    }
    
    public Calendario findById(Long id) {
        return calendarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Evento de calendario no encontrado con ID: " + id));
    }
    
    public Calendario save(Calendario calendario) {
        return calendarioRepository.save(calendario);
    }
    
    public Calendario update(Long id, Calendario calendarioDetails) {
        Calendario calendario = findById(id);
        
        calendario.setTitulo(calendarioDetails.getTitulo());
        calendario.setDescripcion(calendarioDetails.getDescripcion());
        calendario.setFechaInicio(calendarioDetails.getFechaInicio());
        calendario.setFechaFin(calendarioDetails.getFechaFin());
        calendario.setTipoEvento(calendarioDetails.getTipoEvento());
        calendario.setEstado(calendarioDetails.getEstado());
        
        if (calendarioDetails.getCliente() != null) {
            calendario.setCliente(calendarioDetails.getCliente());
        }
        
        if (calendarioDetails.getEquipo() != null) {
            calendario.setEquipo(calendarioDetails.getEquipo());
        }
        
        if (calendarioDetails.getTecnico() != null) {
            calendario.setTecnico(calendarioDetails.getTecnico());
        }
        
        if (calendarioDetails.getOrdenMantenimiento() != null) {
            calendario.setOrdenMantenimiento(calendarioDetails.getOrdenMantenimiento());
        }
        
        return calendarioRepository.save(calendario);
    }
    
    public void deleteById(Long id) {
        Calendario calendario = findById(id);
        calendarioRepository.delete(calendario);
    }

    // ========== MÉTODOS CON DTOs ==========
    
    public CalendarioDTO findDTOById(Long id) {
        Calendario calendario = findById(id);
        return calendarioMapper.toDTO(calendario);
    }
    
    public List<CalendarioDTO> findAllDTO() {
        List<Calendario> calendarios = findAll();
        return calendarios.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public CalendarioDTO save(CreateCalendarioDTO createDTO) {
        Calendario calendario = calendarioMapper.toEntity(createDTO);
        Calendario saved = calendarioRepository.save(calendario);
        return calendarioMapper.toDTO(saved);
    }
    
    public CalendarioDTO update(Long id, UpdateCalendarioDTO updateDTO) {
        Calendario calendario = findById(id);
        calendarioMapper.updateEntityFromDTO(calendario, updateDTO);
        Calendario updated = calendarioRepository.save(calendario);
        return calendarioMapper.toDTO(updated);
    }

    // ========== MÉTODOS DE CONSULTA ESPECÍFICOS ==========
    
    public List<Calendario> findByFechaRange(LocalDateTime start, LocalDateTime end) {
        return calendarioRepository.findByFechaInicioBetween(start, end);
    }
    
    public List<CalendarioDTO> findByFechaRangeDTO(LocalDateTime start, LocalDateTime end) {
        List<Calendario> calendarios = findByFechaRange(start, end);
        return calendarios.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<Calendario> findByTecnico(Long idTecnico) {
        return calendarioRepository.findByTecnicoIdUsuario(idTecnico);
    }
    
    public List<CalendarioDTO> findByTecnicoDTO(Long idTecnico) {
        List<Calendario> calendarios = findByTecnico(idTecnico);
        return calendarios.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<Calendario> findByCliente(Long idCliente) {
        return calendarioRepository.findByClienteId(idCliente);
    }
    
    public List<CalendarioDTO> findByClienteDTO(Long idCliente) {
        List<Calendario> calendarios = findByCliente(idCliente);
        return calendarios.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<Calendario> findByTipoEvento(TipoEvento tipoEvento) {
        return calendarioRepository.findByTipoEvento(tipoEvento);
    }
    
    public List<Calendario> findByEstado(EstadoEvento estado) {
        return calendarioRepository.findByEstado(estado);
    }

    // ========== MÉTODOS DE NEGOCIO ESPECÍFICOS ==========
    
    public Calendario crearEventoMantenciónProgramada(Long clienteId, LocalDateTime fechaProgramada) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + clienteId));
            
        // Buscar última mantención del cliente
        Optional<OrdenMantenimiento> ultimaMantencion = ordenMantenimientoRepository
            .findTopByEquipoUbicacionClienteIdClienteOrderByHoraIngresoDesc(clienteId);
            
        Calendario evento = new Calendario();
        evento.setCliente(cliente);
        evento.setTipoEvento(TipoEvento.MANTENCION);
        evento.setTitulo("Mantención Programada - " + cliente.getNombre1());
        evento.setDescripcion("Mantención periódica basada en historial");
        evento.setFechaInicio(fechaProgramada);
        evento.setFechaFin(fechaProgramada.plusHours(2));
        evento.setEstado(EstadoEvento.PROGRAMADO);
        evento.setNotificado(false);
        
        if (ultimaMantencion.isPresent()) {
            evento.setEquipo(ultimaMantencion.get().getEquipo());
            evento.setDescripcion("Mantención periódica. Última: " + 
                ultimaMantencion.get().getHoraIngreso().toLocalDate());
        }
        
        return calendarioRepository.save(evento);
    }
    
    public CalendarioDTO crearEventoMantenciónProgramadaDTO(Long clienteId, LocalDateTime fechaProgramada) {
        Calendario evento = crearEventoMantenciónProgramada(clienteId, fechaProgramada);
        return calendarioMapper.toDTO(evento);
    }
    
    public List<Calendario> getEventosProximos() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en24Horas = ahora.plusHours(24);
        return calendarioRepository.findByNotificadoFalseAndFechaInicioBetween(ahora, en24Horas);
    }
    
    public List<CalendarioDTO> getEventosProximosDTO() {
        List<Calendario> eventos = getEventosProximos();
        return eventos.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public void marcarComoNotificado(Long idEvento) {
        Calendario evento = findById(idEvento);
        evento.setNotificado(true);
        calendarioRepository.save(evento);
    }
    
    public List<Calendario> getProximasMantenciones() {
        LocalDateTime ahora = LocalDateTime.now();
        return calendarioRepository.findProximasMantenciones(ahora);
    }
    
    public List<CalendarioDTO> getProximasMantencionesDTO() {
        List<Calendario> mantenciones = getProximasMantenciones();
        return mantenciones.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========
    
    public boolean existsById(Long id) {
        return calendarioRepository.existsById(id);
    }
    
    public long count() {
        return calendarioRepository.count();
    }
    
    public long countByTipoEvento(TipoEvento tipoEvento) {
        return calendarioRepository.countByTipoEvento(tipoEvento);
    }
    
    public long countByEstado(EstadoEvento estado) {
        return calendarioRepository.countByEstado(estado);
    }
    
    // Método para verificar conflictos de horario
    public boolean tieneConflictoHorario(Long idTecnico, LocalDateTime inicio, LocalDateTime fin, Long excludeEventoId) {
        List<Calendario> eventos = calendarioRepository.findByTecnicoIdUsuario(idTecnico);
        
        return eventos.stream()
                .filter(evento -> !evento.getIdCalendario().equals(excludeEventoId))
                .anyMatch(evento -> {
                    LocalDateTime eventoInicio = evento.getFechaInicio();
                    LocalDateTime eventoFin = evento.getFechaFin();
                    
                    // Verificar superposición
                    return (inicio.isBefore(eventoFin) && fin.isAfter(eventoInicio));
                });
    }
    
    // Método para obtener eventos del día actual
    public List<Calendario> getEventosHoy() {
        LocalDateTime hoyInicio = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime hoyFin = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return calendarioRepository.findByFechaInicioBetween(hoyInicio, hoyFin);
    }
    
    public List<CalendarioDTO> getEventosHoyDTO() {
        List<Calendario> eventos = getEventosHoy();
        return eventos.stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Método para cambiar estado de evento
    public CalendarioDTO cambiarEstadoEvento(Long idEvento, EstadoEvento nuevoEstado) {
        Calendario evento = findById(idEvento);
        evento.setEstado(nuevoEstado);
        Calendario actualizado = calendarioRepository.save(evento);
        return calendarioMapper.toDTO(actualizado);
    }
}