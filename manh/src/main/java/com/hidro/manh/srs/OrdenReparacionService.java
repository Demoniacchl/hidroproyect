package com.hidro.manh.srs;

import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.ety.Cliente;
import com.hidro.manh.ety.Ubicacion;
import com.hidro.manh.dto.OrdenReparacionDto;
import com.hidro.manh.enums.ProgresoReparacion;
import com.hidro.manh.rep.OrdenReparacionRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.rep.ClienteRepository;
import com.hidro.manh.rep.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenReparacionService {

    @Autowired
    private OrdenReparacionRepository ordenReparacionRepository;
    
    @Autowired
    private EquipoMotorRepository equipoMotorRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UbicacionRepository ubicacionRepository;

    // MÉTODOS CRUD
    public Optional<OrdenReparacion> findById(Long id) {
        return ordenReparacionRepository.findById(id);
    }
    
    public List<OrdenReparacion> findAll() {
        return ordenReparacionRepository.findAll();
    }
    
    public void deleteById(Long id) {
        ordenReparacionRepository.deleteById(id);
    }
    
    public OrdenReparacion save(OrdenReparacion ordenReparacion) {
        return ordenReparacionRepository.save(ordenReparacion);
    }

    // MÉTODOS DE NEGOCIO
    public OrdenReparacion actualizarProgreso(Long id, ProgresoReparacion progreso) {
        OrdenReparacion orden = ordenReparacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orden de reparación no encontrada"));
        
        orden.setProgreso(progreso);
        return ordenReparacionRepository.save(orden);
    }
    
    public OrdenReparacion actualizarProgresoFromString(Long id, String progresoStr) {
        ProgresoReparacion progreso;
        try {
            progreso = ProgresoReparacion.valueOf(progresoStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Valor de progreso inválido: " + progresoStr);
        }
        return actualizarProgreso(id, progreso);
    }

    // MÉTODOS DE CONVERSIÓN DTO - ENTITY (CORREGIDOS)
    public OrdenReparacionDto convertToDto(OrdenReparacion entity) {
        return OrdenReparacionDto.builder()
            .idOrdenReparacion(entity.getIdOrdenReparacion())
            .idMotor(entity.getMotor() != null ? entity.getMotor().getIdMotor() : null)
            .idTecnico(entity.getTecnico() != null ? entity.getTecnico().getIdUsuario() : null)
            .fecha(entity.getFecha())
            .observaciones(entity.getObservaciones())
            .progreso(entity.getProgreso())
            .firmaCliente(entity.getFirmaCliente())
            .idCliente(entity.getCliente() != null ? entity.getCliente().getIdCliente() : null)
            .idUbicacion(entity.getUbicacion() != null ? entity.getUbicacion().getIdUbicacion() : null) // ← NUEVO: AÑADIDO idUbicacion
            .build();
    }
    
    public OrdenReparacion convertToEntity(OrdenReparacionDto dto) {
        OrdenReparacion entity = new OrdenReparacion();
        
        // CAMPOS BÁSICOS
        entity.setIdOrdenReparacion(dto.getIdOrdenReparacion());
        entity.setFecha(dto.getFecha());
        entity.setObservaciones(dto.getObservaciones());
        entity.setProgreso(dto.getProgreso());
        entity.setFirmaCliente(dto.getFirmaCliente());
        
        // RELACIONES FK
        if (dto.getIdMotor() != null) {
            EquipoMotor motor = equipoMotorRepository.findById(dto.getIdMotor())
                .orElseThrow(() -> new RuntimeException("Motor no encontrado con ID: " + dto.getIdMotor()));
            entity.setMotor(motor);
        }
        
        if (dto.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico())
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado con ID: " + dto.getIdTecnico()));
            entity.setTecnico(tecnico);
        }
        
        if (dto.getIdCliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + dto.getIdCliente()));
            entity.setCliente(cliente);
        }
        
        // NUEVO: CARGAR UBICACIÓN
        if (dto.getIdUbicacion() != null) {
            Ubicacion ubicacion = ubicacionRepository.findById(dto.getIdUbicacion())
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + dto.getIdUbicacion()));
            entity.setUbicacion(ubicacion);
        }
        
        return entity;
    }

    // MÉTODOS DE CONSULTA PARA EL FRONTEND
    public List<OrdenReparacion> findByClienteId(Long clienteId) {
        return ordenReparacionRepository.findByMotorUbicacionClienteIdCliente(clienteId);
    }
    
    public List<OrdenReparacion> findByMotorId(Long motorId) {
        return ordenReparacionRepository.findByMotorId(motorId);
    }
    
    public List<OrdenReparacion> findByRangoFechas(String inicioStr, String finStr) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date inicio = format.parse(inicioStr);
            Date fin = format.parse(finStr);
            
            // Ajustar fin para que incluya todo el día
            Calendar cal = Calendar.getInstance();
            cal.setTime(fin);
            cal.add(Calendar.DAY_OF_MONTH, 1);
            fin = cal.getTime();
            
            return ordenReparacionRepository.findByRangoFechas(inicio, fin);
        } catch (ParseException e) {
            throw new RuntimeException("Formato de fecha inválido. Use yyyy-MM-dd", e);
        }
    }
}