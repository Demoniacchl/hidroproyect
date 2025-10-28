package com.hidro.manh.srs;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.dto.CalendarioDTO;
import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.rep.CalendarioRepository;
import com.hidro.manh.rep.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarioService {

    @Autowired
    private CalendarioRepository calendarioRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;

    // MÉTODO FALTANTE QUE CAUSA ERROR
    public void crearEventoMantenciónProgramada(Long clienteId, LocalDateTime fecha) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        Calendario evento = new Calendario();
        evento.setTitulo("Mantención Programada - " + cliente.getNcliente());
        evento.setTipoEvento(TipoEvento.MANTENCION);
        evento.setFechaInicio(fecha);
        evento.setFechaFin(fecha.plusHours(2));
        evento.setCliente(cliente);
        evento.setDescripcion("Mantención programada para el cliente");
        
        calendarioRepository.save(evento);
    }

    // MÉTODOS EXISTENTES (mantener)
    public List<Calendario> getAll() {
        return calendarioRepository.findAll();
    }
    
    public Optional<Calendario> getById(Long id) {
        return calendarioRepository.findById(id);
    }
    
    public Calendario save(Calendario calendario) {
        return calendarioRepository.save(calendario);
    }
    
    public void delete(Long id) {
        calendarioRepository.deleteById(id);
    }
    
    public List<Calendario> findByClienteId(Long clienteId) {
        return calendarioRepository.findByClienteIdCliente(clienteId);
    }
    
    public List<Calendario> findByTipoEventoAndFechaInicioAfter(TipoEvento tipoEvento, LocalDateTime fecha) {
        return calendarioRepository.findByTipoEventoAndFechaInicioAfter(tipoEvento, fecha);
    }

    
    public List<Calendario> findByFechaRange(LocalDateTime start, LocalDateTime end) {
        return calendarioRepository.findByFechaInicioBetween(start, end);
    }
    
    public List<Calendario> findByTecnico(Long tecnicoId) {
        return calendarioRepository.findByTecnicoIdUsuario(tecnicoId);
    }
    
    public List<Calendario> findByCliente(Long clienteId) {
        return calendarioRepository.findByClienteIdCliente(clienteId);
    }
    
    public Calendario update(Long id, Calendario updatedEvento) {
        Optional<Calendario> optionalEvento = calendarioRepository.findById(id);
        if (optionalEvento.isPresent()) {
            Calendario evento = optionalEvento.get();
            evento.setTitulo(updatedEvento.getTitulo());
            evento.setDescripcion(updatedEvento.getDescripcion());
            evento.setFechaInicio(updatedEvento.getFechaInicio());
            evento.setFechaFin(updatedEvento.getFechaFin());
            evento.setTipoEvento(updatedEvento.getTipoEvento());
            evento.setTecnico(updatedEvento.getTecnico());
            evento.setCliente(updatedEvento.getCliente());
            evento.setIdUbicacion(updatedEvento.getIdUbicacion());
            return calendarioRepository.save(evento);
        } else {
            throw new RuntimeException("Evento no encontrado con id: " + id);
        }
    }

    public Collection<CalendarioDTO> findByUbicacionId(Long ubicacionId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUbicacionId'");
    }
}