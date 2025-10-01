package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.SolicitudRepository;
import com.hidro.manh.map.SolicitudMapper;
import com.hidro.manh.dto.AprobacionDTO;
import com.hidro.manh.dto.RechazoDTO;
import com.hidro.manh.dto.SolicitudDto;
import com.hidro.manh.ety.Solicitud;

@Service
@RequiredArgsConstructor
public class SolicitudService {
    private final SolicitudRepository repo;
    private final SolicitudMapper mapper;

    public List<SolicitudDto> getAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public SolicitudDto getById(Long id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    public SolicitudDto save(SolicitudDto dto) {
        Solicitud entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    // Agregar estos métodos a tu SolicitudService.java existente

public Solicitud aprobarSolicitud(Long id, AprobacionDTO aprobacion) {
    Solicitud solicitud = findById(id);
    solicitud.setEstado("APROBADO");
    solicitud.setObservacionesAdmin(aprobacion.getObservaciones());
    solicitud.setFechaRevision(LocalDateTime.now());
    return solicitudRepository.save(solicitud);
}

public Solicitud rechazarSolicitud(Long id, RechazoDTO rechazo) {
    Solicitud solicitud = findById(id);
    solicitud.setEstado("RECHAZADO");
    solicitud.setObservacionesAdmin(rechazo.getMotivo() + ". " + rechazo.getObservaciones());
    solicitud.setFechaRevision(LocalDateTime.now());
    return solicitudRepository.save(solicitud);
}

public List<Solicitud> findPendientes() {
    return solicitudRepository.findByEstado("PENDIENTE");
}

public List<Solicitud> findByEstado(String estado) {
    return solicitudRepository.findByEstado(estado);
}
}
