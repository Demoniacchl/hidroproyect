package com.hidro.manh.ctrl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hidro.manh.srs.UsuarioSrs;
import com.hidro.manh.dto.UsuarioDto;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController{

    private final UsuarioSrs service;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<UsuarioDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public UsuarioDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public UsuarioDto create(@RequestBody UsuarioDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public UsuarioDto update(@PathVariable Long id, @RequestBody UsuarioDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
