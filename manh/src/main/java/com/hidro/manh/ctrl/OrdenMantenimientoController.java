package com.hidro.manh.ctrl;

import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.srs.OrdenMantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes-mantenimiento")
public class OrdenMantenimientoController {

    @Autowired
    private OrdenMantenimientoService service;

    @GetMapping
    public List<OrdenMantenimientoDto> getAll() {
        return service.getAll().stream()
                .map(service::convertToDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrdenMantenimientoDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(service::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<OrdenMantenimientoDto> create(@RequestBody OrdenMantenimientoDto dto) {
        try {
            var entity = service.convertToEntity(dto);
            var savedEntity = service.save(entity);
            return ResponseEntity.ok(service.convertToDto(savedEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrdenMantenimientoDto> update(@PathVariable Long id, @RequestBody OrdenMantenimientoDto dto) {
        try {
            if (!service.getById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            var entity = service.convertToEntity(dto);
            entity.setIdOrden(id);
            var updatedEntity = service.save(entity);
            return ResponseEntity.ok(service.convertToDto(updatedEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.getById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // NUEVOS ENDPOINTS PARA EL FRONTEND
    @GetMapping("/motor/{motorId}")
    public List<OrdenMantenimientoDto> getByMotor(@PathVariable Long motorId) {
        return service.getByMotorId(motorId).stream()
                .map(service::convertToDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/rango-fechas")
    public List<OrdenMantenimientoDto> getByRangoFechas(
            @RequestParam String inicio, 
            @RequestParam String fin) {
        return service.getByRangoFechas(inicio, fin).stream()
                .map(service::convertToDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/cliente/{clienteId}")
    public List<OrdenMantenimientoDto> getByClienteId(@PathVariable Long clienteId) {
        return service.getByClienteId(clienteId).stream()
                .map(service::convertToDto)
                .collect(Collectors.toList());
    }
}