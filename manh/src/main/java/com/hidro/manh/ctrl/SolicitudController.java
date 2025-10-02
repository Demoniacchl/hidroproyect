package com.hidro.manh.ctrl;

import com.hidro.manh.ety.Solicitud;
import com.hidro.manh.srs.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    // MÉTODOS EXISTENTES (deben funcionar con las correcciones del service)
    @GetMapping
    public List<Solicitud> getAll() {
        return solicitudService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> getById(@PathVariable Long id) {
        Optional<Solicitud> solicitud = solicitudService.findById(id); // AHORA EXISTE
        return solicitud.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Solicitud create(@RequestBody Solicitud solicitud) {
        return solicitudService.save(solicitud);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> update(@PathVariable Long id, @RequestBody Solicitud solicitud) {
        if (!solicitudService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        solicitud.setIdSolicitud(id);
        return ResponseEntity.ok(solicitudService.save(solicitud));
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Solicitud> updateEstado(
            @PathVariable Long id, 
            @RequestParam String estado) {
        try {
            Solicitud solicitud = solicitudService.actualizarEstadoFromString(id, estado);
            return ResponseEntity.ok(solicitud);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!solicitudService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        solicitudService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}