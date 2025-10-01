package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.map.UsuarioMapper;
import com.hidro.manh.dto.UsuarioDto;
import com.hidro.manh.ety.Usuario;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository repo;
    private final UsuarioMapper mapper;

    public List<UsuarioDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public UsuarioDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public UsuarioDto save(UsuarioDto dto) {
        Usuario entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
