package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.map.EquipoMotorMapper;
import com.hidro.manh.dto.EquipoMotorDto;
import com.hidro.manh.ety.EquipoMotor;

@Service
@RequiredArgsConstructor
public class EquipoMotorService {
    private final EquipoMotorRepository repo;
    private final EquipoMotorMapper mapper;

    public List<EquipoMotorDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public EquipoMotorDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public EquipoMotorDto save(EquipoMotorDto dto) {
        EquipoMotor entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
