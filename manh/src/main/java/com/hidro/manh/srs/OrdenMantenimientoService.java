package com.hidro.manh.srs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.map.OrdenMantenimientoMapper;
import com.hidro.manh.dto.OrdenFinalizacionDTO;
import com.hidro.manh.dto.OrdenInicioDTO;
import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.ety.Usuario;

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
    // Agregar estos métodos a tu OrdenMantenimientoService.java existente

public OrdenMantenimiento iniciarOrden(OrdenInicioDTO ordenInicio) {
    EquipoMotor equipo = equipoMotorRepository.findById(ordenInicio.getIdEquipo())
        .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    
    Usuario tecnico = usuarioRepository.findById(ordenInicio.getIdTecnico())
        .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
    
    OrdenMantenimiento orden = new OrdenMantenimiento();
    orden.setEquipo(equipo);
    orden.setTecnico(tecnico);
    orden.setHoraIngreso(ordenInicio.getHoraIngreso());
    orden.setTipoOrden(ordenInicio.getTipoOrden());
    
    return ordenMantenimientoRepository.save(orden);
}

public OrdenMantenimiento finalizarOrden(Long idOrden, OrdenFinalizacionDTO finalizacion) {
    OrdenMantenimiento orden = findById(idOrden);
    
    orden.setHoraSalida(finalizacion.getHoraSalida());
    orden.setObservaciones(finalizacion.getObservaciones());
    orden.setCampoAdicional(finalizacion.getCampoAdicional());
    orden.setFirmaCliente(finalizacion.getFirmaCliente());
    
    // Mapear checklist desde Map a campos individuales
    if (finalizacion.getChecklist() != null) {
        Map<String, String> checklist = finalizacion.getChecklist();
        orden.setCambioRodamientos(checklist.getOrDefault("cambioRodamientos", "NO"));
        orden.setCambioSello(checklist.getOrDefault("cambioSello", "NO"));
        orden.setCambioVoluta(checklist.getOrDefault("cambioVoluta", "NO"));
        // ... continuar con los otros 17 campos del checklist
    }
    
    // Lecturas eléctricas
    orden.setR(finalizacion.getLecturaR());
    orden.setS(finalizacion.getLecturaS());
    orden.setT(finalizacion.getLecturaT());
    orden.setVoltaje(finalizacion.getVoltaje());
    
    return ordenMantenimientoRepository.save(orden);
}

public OrdenMantenimiento findUltimaByClienteId(Long clienteId) {
    return ordenMantenimientoRepository
        .findTopByEquipoUbicacionClienteIdClienteOrderByHoraIngresoDesc(clienteId)
        .orElseThrow(() -> new RuntimeException("No se encontraron mantenciones para el cliente"));
}

public List<OrdenReparacion> findReparaciones30DiasByClienteId(Long clienteId) {
    LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
    return ordenReparacionRepository.findByEquipoUbicacionClienteIdClienteAndFechaAfter(clienteId, hace30Dias);
}

public List<OrdenMantenimiento> findByTecnicoId(Long tecnicoId) {
    return ordenMantenimientoRepository.findByTecnicoIdUsuario(tecnicoId);
}

public List<OrdenMantenimiento> findByHoraSalidaIsNull() {
    return ordenMantenimientoRepository.findByHoraSalidaIsNull();
}
}
