package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.map.OrdenMantenimientoMapper;
import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.ety.OrdenMantenimiento;

@Service
@RequiredArgsConstructor
public class OrdenMantenimientoService {
    private final OrdenMantenimientoRepository repo;
    private final OrdenMantenimientoMapper mapper;

    public List<OrdenMantenimientoDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public OrdenMantenimientoDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public OrdenMantenimientoDto save(OrdenMantenimientoDto dto) {
        OrdenMantenimiento entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
