package com.hidro.manh.ctrl;

import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.srs.OrdenReparacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes-reparacion")
public class OrdenReparacionController {

    @Autowired
    private OrdenReparacionService ordenReparacionService;

    // MÉTODOS CORREGIDOS
    @GetMapping
    public List<OrdenReparacion> getAll() {
        return ordenReparacionService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrdenReparacion> getById(@PathVariable Long id) {
        Optional<OrdenReparacion> orden = ordenReparacionService.findById(id);
        return orden.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public OrdenReparacion create(@RequestBody OrdenReparacion ordenReparacion) {
        return ordenReparacionService.save(ordenReparacion);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrdenReparacion> update(@PathVariable Long id, @RequestBody OrdenReparacion ordenReparacion) {
        if (!ordenReparacionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        ordenReparacion.setIdOrdenReparacion(id);
        return ResponseEntity.ok(ordenReparacionService.save(ordenReparacion));
    }
    
    @PutMapping("/{id}/progreso")
    public ResponseEntity<OrdenReparacion> updateProgreso(
            @PathVariable Long id, 
            @RequestParam String progreso) {
        try {
            OrdenReparacion orden = ordenReparacionService.actualizarProgresoFromString(id, progreso);
            return ResponseEntity.ok(orden);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!ordenReparacionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        ordenReparacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/cliente/{clienteId}")
    public List<OrdenReparacion> getByClienteId(@PathVariable Long clienteId) {
        return ordenReparacionService.findByEquipoUbicacionClienteIdCliente(clienteId);
    }
}