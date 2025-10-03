package com.hidro.manh.ctrl;

import com.hidro.manh.dto.OrdenReparacionDto;
import com.hidro.manh.srs.OrdenReparacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes-reparacion")
public class OrdenReparacionController {

    @Autowired
    private OrdenReparacionService ordenReparacionService;

    @GetMapping
    public List<OrdenReparacionDto> getAll() {
        return ordenReparacionService.findAll().stream()
                .map(ordenReparacionService::convertToDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrdenReparacionDto> getById(@PathVariable Long id) {
        return ordenReparacionService.findById(id)
                .map(ordenReparacionService::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<OrdenReparacionDto> create(@RequestBody OrdenReparacionDto dto) {
        try {
            var entity = ordenReparacionService.convertToEntity(dto);
            var savedEntity = ordenReparacionService.save(entity);
            return ResponseEntity.ok(ordenReparacionService.convertToDto(savedEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrdenReparacionDto> update(@PathVariable Long id, @RequestBody OrdenReparacionDto dto) {
        try {
            if (!ordenReparacionService.findById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            var entity = ordenReparacionService.convertToEntity(dto);
            entity.setIdOrdenReparacion(id);
            var updatedEntity = ordenReparacionService.save(entity);
            return ResponseEntity.ok(ordenReparacionService.convertToDto(updatedEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/progreso")
    public ResponseEntity<OrdenReparacionDto> updateProgreso(
            @PathVariable Long id, 
            @RequestParam String progreso) {
        try {
            var orden = ordenReparacionService.actualizarProgresoFromString(id, progreso);
            return ResponseEntity.ok(ordenReparacionService.convertToDto(orden));
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
    
    // ENDPOINTS EXISTENTES
    @GetMapping("/cliente/{clienteId}")
    public List<OrdenReparacionDto> getByClienteId(@PathVariable Long clienteId) {
        return ordenReparacionService.findByClienteId(clienteId).stream()
                .map(ordenReparacionService::convertToDto)
                .collect(Collectors.toList());
    }
    
    // NUEVOS ENDPOINTS PARA EL FRONTEND
    @GetMapping("/motor/{motorId}")
    public List<OrdenReparacionDto> getByMotorId(@PathVariable Long motorId) {
        return ordenReparacionService.findByMotorId(motorId).stream()
                .map(ordenReparacionService::convertToDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/rango-fechas")
    public List<OrdenReparacionDto> getByRangoFechas(
            @RequestParam String inicio, 
            @RequestParam String fin) {
        return ordenReparacionService.findByRangoFechas(inicio, fin).stream()
                .map(ordenReparacionService::convertToDto)
                .collect(Collectors.toList());
    }
}