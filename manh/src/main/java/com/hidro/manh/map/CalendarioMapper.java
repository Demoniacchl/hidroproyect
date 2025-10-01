// map/CalendarioMapper.java - VERSIÓN CORREGIDA
package com.hidro.manh.map;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.dto.CalendarioDTO;
import com.hidro.manh.dto.CreateCalendarioDTO;
import com.hidro.manh.dto.UpdateCalendarioDTO;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.rep.OrdenReparacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CalendarioMapper {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EquipoMotorRepository equipoMotorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    @Autowired
    private OrdenReparacionRepository ordenReparacionRepository;

    // Convertir Entidad a DTO
    public CalendarioDTO toDTO(Calendario calendario) {
        if (calendario == null) {
            return null;
        }

        CalendarioDTO dto = new CalendarioDTO();
        dto.setIdCalendario(calendario.getIdCalendario());
        dto.setTipoEvento(calendario.getTipoEvento());
        dto.setTitulo(calendario.getTitulo());
        dto.setDescripcion(calendario.getDescripcion());
        dto.setFechaInicio(calendario.getFechaInicio());
        dto.setFechaFin(calendario.getFechaFin());
        dto.setEstado(calendario.getEstado());
        dto.setNotificado(calendario.getNotificado());

        // Mapear relaciones Cliente
        if (calendario.getCliente() != null) {
            dto.setIdCliente(calendario.getCliente().getIdCliente());
            dto.setNombreCliente(calendario.getCliente().getNombre1());
        }

        // Mapear relaciones EquipoMotor
        if (calendario.getEquipo() != null) {
            dto.setIdEquipo(calendario.getEquipo().getIdMotor());
            dto.setNombreEquipo(calendario.getEquipo().getMarca() + " " + calendario.getEquipo().getModelo());
        }

        // Mapear relaciones Usuario (Técnico)
        if (calendario.getTecnico() != null) {
            dto.setIdTecnico(calendario.getTecnico().getIdUsuario());
            dto.setNombreTecnico(calendario.getTecnico().getNombre());
        }

        // Mapear relaciones OrdenMantenimiento
        if (calendario.getOrdenMantenimiento() != null) {
            dto.setIdOrdenMantenimiento(calendario.getOrdenMantenimiento().getIdOrden());
        }

        // Mapear relaciones OrdenReparacion
        if (calendario.getOrdenReparacion() != null) {
            dto.setIdOrdenReparacion(calendario.getOrdenReparacion().getIdOrdenReparacion());
        }

        return dto;
    }

    // Convertir Lista de Entidades a Lista de DTOs
    public List<CalendarioDTO> toDTOList(List<Calendario> calendarios) {
        return calendarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Convertir CreateDTO a Entidad
    public Calendario toEntity(CreateCalendarioDTO dto) {
        if (dto == null) {
            return null;
        }

        Calendario calendario = new Calendario();
        calendario.setTipoEvento(dto.getTipoEvento());
        calendario.setTitulo(dto.getTitulo());
        calendario.setDescripcion(dto.getDescripcion());
        calendario.setFechaInicio(dto.getFechaInicio());
        calendario.setFechaFin(dto.getFechaFin());
        calendario.setEstado(dto.getEstado());
        calendario.setNotificado(false);

        // Mapear relaciones desde IDs
        if (dto.getIdCliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            calendario.setCliente(cliente);
        }

        if (dto.getIdEquipo() != null) {
            EquipoMotor equipo = equipoMotorRepository.findById(dto.getIdEquipo())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            calendario.setEquipo(equipo);
        }

        if (dto.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico())
                    .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
            calendario.setTecnico(tecnico);
        }

        // NOTA: CreateCalendarioDTO no tiene campos para órdenes de mantenimiento/reparación
        // Estas relaciones se establecerían posteriormente si es necesario

        return calendario;
    }

    // Actualizar Entidad desde UpdateDTO
    public Calendario updateEntityFromDTO(Calendario calendario, UpdateCalendarioDTO dto) {
        if (dto == null) {
            return calendario;
        }

        if (dto.getTitulo() != null) {
            calendario.setTitulo(dto.getTitulo());
        }
        
        if (dto.getDescripcion() != null) {
            calendario.setDescripcion(dto.getDescripcion());
        }
        
        if (dto.getFechaInicio() != null) {
            calendario.setFechaInicio(dto.getFechaInicio());
        }
        
        if (dto.getFechaFin() != null) {
            calendario.setFechaFin(dto.getFechaFin());
        }
        
        if (dto.getTipoEvento() != null) {
            calendario.setTipoEvento(dto.getTipoEvento());
        }
        
        if (dto.getEstado() != null) {
            calendario.setEstado(dto.getEstado());
        }

        // Actualizar relaciones si se proporcionan
        if (dto.getIdCliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            calendario.setCliente(cliente);
        }

        if (dto.getIdEquipo() != null) {
            EquipoMotor equipo = equipoMotorRepository.findById(dto.getIdEquipo())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            calendario.setEquipo(equipo);
        }

        if (dto.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico())
                    .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
            calendario.setTecnico(tecnico);
        }

        // NOTA: UpdateCalendarioDTO no tiene campos para órdenes de mantenimiento/reparación
        // Estas relaciones se manejarían en servicios específicos si es necesario

        return calendario;
    }

    // Método para crear DTO básico (sin relaciones complejas)
    public CalendarioDTO toBasicDTO(Calendario calendario) {
        if (calendario == null) {
            return null;
        }

        CalendarioDTO dto = new CalendarioDTO();
        dto.setIdCalendario(calendario.getIdCalendario());
        dto.setTipoEvento(calendario.getTipoEvento());
        dto.setTitulo(calendario.getTitulo());
        dto.setDescripcion(calendario.getDescripcion());
        dto.setFechaInicio(calendario.getFechaInicio());
        dto.setFechaFin(calendario.getFechaFin());
        dto.setEstado(calendario.getEstado());
        dto.setNotificado(calendario.getNotificado());

        return dto;
    }
}