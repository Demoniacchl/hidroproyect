package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.OrdenReparacionRepository;
import com.hidro.manh.map.OrdenReparacionMapper;
import com.hidro.manh.dto.OrdenReparacionDto;
import com.hidro.manh.ety.OrdenReparacion;

@Service
@RequiredArgsConstructor
public class OrdenReparacionService {
    private final OrdenReparacionRepository repo;
    private final OrdenReparacionMapper mapper;

    public List<OrdenReparacionDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public OrdenReparacionDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public OrdenReparacionDto save(OrdenReparacionDto dto) {
        OrdenReparacion entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
