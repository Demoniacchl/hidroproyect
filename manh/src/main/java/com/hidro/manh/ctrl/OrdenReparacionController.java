package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.OrdenReparacionService;
import com.hidro.manh.dto.OrdenReparacionDto;

@RestController
@RequestMapping("/api/orden-reparacion")
@RequiredArgsConstructor
public class OrdenReparacionController {
    private final OrdenReparacionService service;

    @GetMapping
    public List<OrdenReparacionDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public OrdenReparacionDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public OrdenReparacionDto create(@RequestBody OrdenReparacionDto dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public OrdenReparacionDto update(@PathVariable Long id, @RequestBody OrdenReparacionDto dto) {
        // set id reflectively if necessary (simple approach)
        try { java.lang.reflect.Field f = dto.getClass().getDeclaredFields()[0]; f.setAccessible(true); f.set(dto, id); } catch (Exception e) { /* ignore */ }
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
