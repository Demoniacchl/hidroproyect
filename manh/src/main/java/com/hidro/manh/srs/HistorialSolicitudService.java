package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.HistorialSolicitudRepository;
import com.hidro.manh.map.HistorialSolicitudMapper;
import com.hidro.manh.dto.HistorialSolicitudDto;
import com.hidro.manh.ety.HistorialSolicitud;

@Service
@RequiredArgsConstructor
public class HistorialSolicitudService {
    private final HistorialSolicitudRepository repo;
    private final HistorialSolicitudMapper mapper;

    public List<HistorialSolicitudDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public HistorialSolicitudDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public HistorialSolicitudDto save(HistorialSolicitudDto dto) {
        HistorialSolicitud entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
