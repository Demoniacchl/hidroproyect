package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.map.UsuarioMapper;
import com.hidro.manh.dto.UsuarioDto;
import com.hidro.manh.ety.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.hidro.manh.enums.RolUsuario;

@Service
@RequiredArgsConstructor
public class UsuarioSrs {

    private final UsuarioRepository repo;
    private final UsuarioMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public UsuarioDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    @Transactional
    public UsuarioDto create(UsuarioDto dto) {
        if (dto.getUsuario() == null) throw new IllegalArgumentException("usuario required");
        if (repo.existsByUsuario(dto.getUsuario())) throw new IllegalArgumentException("usuario exists");

        Usuario u = mapper.toEntity(dto);
        // encode password if provided in plain text
        if (dto.getContrasena() != null) {
            u.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        }
        // default role if null
        if (u.getRol() == null) u.setRol(RolUsuario.TECNICO);
        Usuario saved = repo.save(u);
        return mapper.toDto(saved);
    }

    @Transactional
    public UsuarioDto update(Long id, UsuarioDto dto) {
        Usuario existing = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario not found"));
        if (dto.getNombre() != null) existing.setNombre(dto.getNombre());
        if (dto.getRol() != null) existing.setRol(dto.getRol());
        if (dto.getUsuario() != null) existing.setUsuario(dto.getUsuario());
        if (dto.getContrasena() != null) existing.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        Usuario saved = repo.save(existing);
        return mapper.toDto(saved);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
