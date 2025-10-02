package com.hidro.manh.ctrl;

import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.srs.OrdenMantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes-mantenimiento")
public class OrdenMantenimientoController {

    @Autowired
    private OrdenMantenimientoService service;

    // MÉTODOS CORREGIDOS - USANDO MÉTODOS QUE AHORA EXISTEN
    @GetMapping
    public List<OrdenMantenimiento> getAll() {
        return service.getAll(); // AHORA EXISTE
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrdenMantenimiento> getById(@PathVariable Long id) {
        Optional<OrdenMantenimiento> orden = service.getById(id); // AHORA EXISTE
        return orden.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<OrdenMantenimiento> create(@RequestBody OrdenMantenimientoDto dto) {
        try {
            // CONVERTIR DTO A ENTITY ANTES DE GUARDAR
            OrdenMantenimiento entity = service.convertToEntity(dto);
            OrdenMantenimiento saved = service.save(entity);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrdenMantenimiento> update(@PathVariable Long id, @RequestBody OrdenMantenimientoDto dto) {
        try {
            if (!service.getById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            // CONVERTIR DTO A ENTITY
            OrdenMantenimiento entity = service.convertToEntity(dto);
            entity.setIdOrden(id); // MANTENER EL MISMO ID
            OrdenMantenimiento updated = service.save(entity);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        service.delete(id); // AHORA EXISTE
        return ResponseEntity.noContent().build();
    }

    // MÉTODOS EXISTENTES
    @GetMapping("/motor/{motorId}")
    public List<OrdenMantenimiento> getByMotor(@PathVariable Long motorId) {
        // Este método necesitaría implementación adicional en el service
        return List.of();
    }
    
    @GetMapping("/rango-fechas")
    public List<OrdenMantenimiento> getByRangoFechas(
            @RequestParam String inicio, 
            @RequestParam String fin) {
        // Este método necesitaría implementación adicional en el service
        return List.of();
    }
}