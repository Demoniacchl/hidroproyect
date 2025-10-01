package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.EquipoMotorService;
import com.hidro.manh.dto.EquipoMotorDto;

@RestController
@RequestMapping("/api/equipomotor")
@RequiredArgsConstructor
public class EquipoMotorController {
    private final EquipoMotorService service;

    @GetMapping
    public List<EquipoMotorDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EquipoMotorDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public EquipoMotorDto create(@RequestBody EquipoMotorDto dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public EquipoMotorDto update(@PathVariable Long id, @RequestBody EquipoMotorDto dto) {
        // set id reflectively if necessary (simple approach)
        try { java.lang.reflect.Field f = dto.getClass().getDeclaredFields()[0]; f.setAccessible(true); f.set(dto, id); } catch (Exception e) { /* ignore */ }
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
