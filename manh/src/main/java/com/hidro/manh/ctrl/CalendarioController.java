package com.hidro.manh.ctrl;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.srs.CalendarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendario")
@CrossOrigin(origins = "*")
public class CalendarioController {
    
    @Autowired
    private CalendarioService calendarioService;
    
    @GetMapping
    public List<Calendario> getAllEventos() {
        return calendarioService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Calendario> getEventoById(@PathVariable Long id) {
        Calendario evento = calendarioService.findById(id);
        return ResponseEntity.ok(evento);
    }
    
    @PostMapping
    public Calendario createEvento(@RequestBody Calendario evento) {
        return calendarioService.save(evento);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Calendario> updateEvento(@PathVariable Long id, @RequestBody Calendario eventoDetails) {
        Calendario updatedEvento = calendarioService.update(id, eventoDetails);
        return ResponseEntity.ok(updatedEvento);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvento(@PathVariable Long id) {
        calendarioService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/rango")
    public List<Calendario> getEventosPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return calendarioService.findByFechaRange(start, end);
    }
    
    @GetMapping("/tecnico/{tecnicoId}")
    public List<Calendario> getEventosPorTecnico(@PathVariable Long tecnicoId) {
        return calendarioService.findByTecnico(tecnicoId);
    }
    
    @GetMapping("/cliente/{clienteId}")
    public List<Calendario> getEventosPorCliente(@PathVariable Long clienteId) {
        return calendarioService.findByCliente(clienteId);
    }
    
    @PostMapping("/programar-mantencion/{clienteId}")
    public Calendario programarMantención(
            @PathVariable Long clienteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha) {
        return calendarioService.crearEventoMantenciónProgramada(clienteId, fecha);
    }
    
    @GetMapping("/proximos")
    public List<Calendario> getEventosProximos() {
        return calendarioService.getEventosProximos();
    }
    
    @PutMapping("/{id}/notificado")
    public ResponseEntity<?> marcarNotificado(@PathVariable Long id) {
        calendarioService.marcarComoNotificado(id);
        return ResponseEntity.ok().build();
    }
}