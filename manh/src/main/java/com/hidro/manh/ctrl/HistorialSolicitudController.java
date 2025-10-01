package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.HistorialSolicitudService;
import com.hidro.manh.dto.HistorialSolicitudDto;

@RestController
@RequestMapping("/api/historial-solicitud")
@RequiredArgsConstructor
public class HistorialSolicitudController {
    private final HistorialSolicitudService service;

    @GetMapping
    public List<HistorialSolicitudDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public HistorialSolicitudDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HistorialSolicitudDto create(@RequestBody HistorialSolicitudDto dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public HistorialSolicitudDto update(@PathVariable Long id, @RequestBody HistorialSolicitudDto dto) {
        // set id reflectively if necessary (simple approach)
        try { java.lang.reflect.Field f = dto.getClass().getDeclaredFields()[0]; f.setAccessible(true); f.set(dto, id); } catch (Exception e) { /* ignore */ }
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
