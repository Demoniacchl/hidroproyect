package com.hidro.manh.ctrl;

import com.hidro.manh.dto.CalendarioDTO;
import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.srs.CalendarioService;
import com.hidro.manh.map.CalendarioMapper;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    @Autowired
    private CalendarioService calendarioService;

    @Autowired
    private CalendarioMapper calendarioMapper;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EquipoMotorRepository equipoMotorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // MÉTODO CORREGIDO - USANDO EL NOMBRE EXACTO
    @PostMapping("/evento-mantencion-programada")
    public ResponseEntity<String> crearEventoMantenciónProgramada(
            @RequestParam Long clienteId, 
            @RequestParam LocalDateTime fecha) {
        try {
            calendarioService.crearEventoMantenciónProgramada(clienteId, fecha);
            return ResponseEntity.ok("Evento de mantención programada creado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear evento: " + e.getMessage());
        }
    }

    // ✅ MÉTODOS CORREGIDOS - AHORA USAN DTOs
    @GetMapping
    public List<CalendarioDTO> getAll() {
        return calendarioService.getAll().stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CalendarioDTO> getById(@PathVariable Long id) {
        Optional<Calendario> calendario = calendarioService.getById(id);
        return calendario.map(c -> ResponseEntity.ok(calendarioMapper.toDTO(c)))
                        .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public CalendarioDTO create(@RequestBody CalendarioDTO calendarioDTO) {
        Calendario calendario = new Calendario();
        
        // Mapear campos básicos
        calendario.setTitulo(calendarioDTO.getTitulo());
        calendario.setDescripcion(calendarioDTO.getDescripcion());
        calendario.setFechaInicio(calendarioDTO.getFechaInicio());
        calendario.setFechaFin(calendarioDTO.getFechaFin());
        calendario.setTipoEvento(calendarioDTO.getTipoEvento());
        calendario.setEstado(calendarioDTO.getEstado());
        calendario.setNotificado(false);
        
        // ✅ MAPEAR RELACIONES DESDE IDs
        if (calendarioDTO.getIdCliente() != null) {
            Cliente cliente = clienteRepository.findById(calendarioDTO.getIdCliente())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + calendarioDTO.getIdCliente()));
            calendario.setCliente(cliente);
        }
        
        if (calendarioDTO.getIdEquipo() != null) {
            EquipoMotor equipo = equipoMotorRepository.findById(calendarioDTO.getIdEquipo())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + calendarioDTO.getIdEquipo()));
            calendario.setEquipo(equipo);
        }
        
        if (calendarioDTO.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(calendarioDTO.getIdTecnico())
                    .orElseThrow(() -> new RuntimeException("Técnico no encontrado con ID: " + calendarioDTO.getIdTecnico()));
            calendario.setTecnico(tecnico);
        }
        
        Calendario saved = calendarioService.save(calendario);
        return calendarioMapper.toDTO(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CalendarioDTO> update(@PathVariable Long id, @RequestBody CalendarioDTO calendarioDTO) {
        Optional<Calendario> existing = calendarioService.getById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Calendario calendario = existing.get();
        // Actualizar campos básicos
        if (calendarioDTO.getTitulo() != null) calendario.setTitulo(calendarioDTO.getTitulo());
        if (calendarioDTO.getDescripcion() != null) calendario.setDescripcion(calendarioDTO.getDescripcion());
        if (calendarioDTO.getFechaInicio() != null) calendario.setFechaInicio(calendarioDTO.getFechaInicio());
        if (calendarioDTO.getFechaFin() != null) calendario.setFechaFin(calendarioDTO.getFechaFin());
        if (calendarioDTO.getTipoEvento() != null) calendario.setTipoEvento(calendarioDTO.getTipoEvento());
        if (calendarioDTO.getEstado() != null) calendario.setEstado(calendarioDTO.getEstado());
        
        // ✅ ACTUALIZAR RELACIONES SI SE PROPORCIONAN
        if (calendarioDTO.getIdCliente() != null) {
            Cliente cliente = clienteRepository.findById(calendarioDTO.getIdCliente())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            calendario.setCliente(cliente);
        }
        
        if (calendarioDTO.getIdEquipo() != null) {
            EquipoMotor equipo = equipoMotorRepository.findById(calendarioDTO.getIdEquipo())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            calendario.setEquipo(equipo);
        }
        
        if (calendarioDTO.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(calendarioDTO.getIdTecnico())
                    .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
            calendario.setTecnico(tecnico);
        }
        
        Calendario updated = calendarioService.save(calendario);
        return ResponseEntity.ok(calendarioMapper.toDTO(updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!calendarioService.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        calendarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/cliente/{clienteId}")
    public List<CalendarioDTO> getByClienteId(@PathVariable Long clienteId) {
        return calendarioService.findByClienteId(clienteId).stream()
                .map(calendarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
}
    
