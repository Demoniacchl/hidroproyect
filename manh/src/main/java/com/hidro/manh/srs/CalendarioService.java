package com.hidro.manh.srs;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.rep.CalendarioRepository;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarioService {
    
    @Autowired
    private CalendarioRepository calendarioRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    // MÉTODOS BÁSICOS (mantener solo estos por ahora)
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
        
        return calendarioRepository.save(calendario);
    }
    
    public void deleteById(Long id) {
        Calendario calendario = findById(id);
        calendarioRepository.delete(calendario);
    }

    // MÉTODOS ESPECÍFICOS SIMPLIFICADOS
    public List<Calendario> findByFechaRange(LocalDateTime start, LocalDateTime end) {
        return calendarioRepository.findByFechaInicioBetween(start, end);
    }
    
    public List<Calendario> findByTecnico(Long idTecnico) {
        return calendarioRepository.findByTecnicoIdUsuario(idTecnico);
    }
    
    public List<Calendario> findByCliente(Long idCliente) {
        return calendarioRepository.findByClienteIdCliente(idCliente);
    }
    
    public List<Calendario> getEventosProximos() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en24Horas = ahora.plusHours(24);
        return calendarioRepository.findByNotificadoFalseAndFechaInicioBetween(ahora, en24Horas);
    }
    
    public void marcarComoNotificado(Long idEvento) {
        Calendario evento = findById(idEvento);
        evento.setNotificado(true);
        calendarioRepository.save(evento);
    }
    