package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.OrdenMantenimientoService;
import com.hidro.manh.dto.OrdenMantenimientoDto;

@RestController
@RequestMapping("/api/orden-mantenimiento")
@RequiredArgsConstructor
public class OrdenMantenimientoController {
    private final OrdenMantenimientoService service;

    @GetMapping
    public List<OrdenMantenimientoDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public OrdenMantenimientoDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public OrdenMantenimientoDto create(@RequestBody OrdenMantenimientoDto dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public OrdenMantenimientoDto update(@PathVariable Long id, @RequestBody OrdenMantenimientoDto dto) {
        // set id reflectively if necessary (simple approach)
        try { java.lang.reflect.Field f = dto.getClass().getDeclaredFields()[0]; f.setAccessible(true); f.set(dto, id); } catch (Exception e) { /* ignore */ }
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
