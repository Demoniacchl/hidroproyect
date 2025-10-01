package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.SolicitudService;
import com.hidro.manh.dto.SolicitudDto;

@RestController
@RequestMapping("/api/solicitud")
@RequiredArgsConstructor
public class SolicitudController {
    private final SolicitudService service;

    @GetMapping
    public List<SolicitudDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SolicitudDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public SolicitudDto create(@RequestBody SolicitudDto dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public SolicitudDto update(@PathVariable Long id, @RequestBody SolicitudDto dto) {
        // set id reflectively if necessary (simple approach)
        try { java.lang.reflect.Field f = dto.getClass().getDeclaredFields()[0]; f.setAccessible(true); f.set(dto, id); } catch (Exception e) { /* ignore */ }
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
