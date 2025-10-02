package com.hidro.manh.ctrl;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.srs.CalendarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    @Autowired
    private CalendarioService calendarioService;

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

    // MÉTODOS EXISTENTES
    @GetMapping
    public List<Calendario> getAll() {
        return calendarioService.getAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Calendario> getById(@PathVariable Long id) {
        Optional<Calendario> calendario = calendarioService.getById(id);
        return calendario.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Calendario create(@RequestBody Calendario calendario) {
        return calendarioService.save(calendario);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Calendario> update(@PathVariable Long id, @RequestBody Calendario calendario) {
        if (!calendarioService.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        calendario.setIdCalendario(id);
        return ResponseEntity.ok(calendarioService.save(calendario));
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
    public List<Calendario> getByClienteId(@PathVariable Long clienteId) {
        return calendarioService.findByClienteId(clienteId);
    }
}