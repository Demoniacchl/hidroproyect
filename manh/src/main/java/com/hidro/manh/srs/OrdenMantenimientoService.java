package com.hidro.manh.srs;

import com.hidro.manh.dto.OrdenInicioDTO;
import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.dto.OrdenFinalizacionDTO;
import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import com.hidro.manh.rep.OrdenReparacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrdenMantenimientoService {

    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;

    @Autowired
    private EquipoMotorRepository equipoMotorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OrdenReparacionRepository ordenReparacionRepository;
 public List<OrdenMantenimiento> getAll() {
        return ordenMantenimientoRepository.findAll();
    }
    
    public Optional<OrdenMantenimiento> getById(Long id) {
        return ordenMantenimientoRepository.findById(id);
    }
    
    // Removed duplicate save(OrdenMantenimiento orden) method to fix compilation error.
    |
    public void delete(Long id) {
        ordenMantenimientoRepository.deleteById(id);
    }
    
    // Método para convertir DTO a Entity
    public OrdenMantenimiento convertToEntity(OrdenMantenimientoDto dto) {
        OrdenMantenimiento entity = new OrdenMantenimiento();
        
        // Mapear campos básicos
        entity.setId(dto.getId());
        entity.setObservaciones(dto.getObservaciones());
        entity.setHoraIngreso(dto.getHoraIngreso());
        entity.setHoraSalida(dto.getHoraSalida());
        
        // Mapear checklist
        entity.setCambioRodamientos(dto.getCambioRodamientos());
        entity.setChecklist02Sello(dto.getChecklist02Sello());
        // ... continuar con todos los campos del checklist
        
        // Mapear lecturas eléctricas
        entity.setM1(dto.getM1());
        entity.setR1(dto.getR1());
        entity.setS1(dto.getS1());
        entity.setT1(dto.getT1());
        entity.setVoltaje10(dto.getVoltaje10());
        // ... continuar con todas las lecturas
        
        return entity;
    }
    // MÉTODOS CRUD BÁSICOS
    public List<OrdenMantenimiento> findAll() {
        return ordenMantenimientoRepository.findAll();
    }

    public OrdenMantenimiento findById(Long id) {
        return ordenMantenimientoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orden de mantenimiento no encontrada con ID: " + id));
    }

    public OrdenMantenimiento save(OrdenMantenimiento ordenMantenimiento) {
        return ordenMantenimientoRepository.save(ordenMantenimiento);
    }

    public OrdenMantenimiento update(Long id, OrdenMantenimiento ordenMantenimientoDetails) {
        OrdenMantenimiento ordenMantenimiento = findById(id);
        
        // Actualizar campos básicos
        ordenMantenimiento.setHoraIngreso(ordenMantenimientoDetails.getHoraIngreso());
        ordenMantenimiento.setHoraSalida(ordenMantenimientoDetails.getHoraSalida());
        ordenMantenimiento.setObservaciones(ordenMantenimientoDetails.getObservaciones());
        ordenMantenimiento.setFirmaCliente(ordenMantenimientoDetails.getFirmaCliente());
        ordenMantenimiento.setCampoAdicional(ordenMantenimientoDetails.getCampoAdicional());
        
        // Actualizar lecturas eléctricas
        ordenMantenimiento.setR(ordenMantenimientoDetails.getR());
        ordenMantenimiento.setS(ordenMantenimientoDetails.getS());
        ordenMantenimiento.setT(ordenMantenimientoDetails.getT());
        ordenMantenimiento.setVoltaje(ordenMantenimientoDetails.getVoltaje());
        
        // Actualizar relaciones
        if (ordenMantenimientoDetails.getMotor() != null) {
            ordenMantenimiento.setMotor(ordenMantenimientoDetails.getMotor());
        }
        if (ordenMantenimientoDetails.getTecnico() != null) {
            ordenMantenimiento.setTecnico(ordenMantenimientoDetails.getTecnico());
        }
        
        return ordenMantenimientoRepository.save(ordenMantenimiento);
    }

    public void deleteById(Long id) {
        OrdenMantenimiento ordenMantenimiento = findById(id);
        ordenMantenimientoRepository.delete(ordenMantenimiento);
    }

    // MÉTODOS DE PROCESO ESPECÍFICOS
    public OrdenMantenimiento iniciarOrden(OrdenInicioDTO ordenInicio) {
        EquipoMotor equipo = equipoMotorRepository.findById(ordenInicio.getIdEquipo())
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        
        Usuario tecnico = usuarioRepository.findById(ordenInicio.getIdTecnico())
            .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
        
        OrdenMantenimiento orden = new OrdenMantenimiento();
        orden.setMotor(equipo);
        orden.setTecnico(tecnico);
        
        // Convertir LocalDateTime a Date
        Date horaingresoDate = java.sql.Timestamp.valueOf(ordenInicio.getHoraIngreso());
        orden.setHoraIngreso(horaingresoDate);
        
        return ordenMantenimientoRepository.save(orden);
    }

    public OrdenMantenimiento finalizarOrden(Long idOrden, OrdenFinalizacionDTO finalizacion) {
        OrdenMantenimiento orden = findById(idOrden);
        
        // Convertir LocalDateTime a Date
        Date horasalidaDate = java.sql.Timestamp.valueOf(finalizacion.getHoraSalida());
        orden.setHoraSalida(horasalidaDate);
        
        orden.setObservaciones(finalizacion.getObservaciones());
        orden.setCampoAdicional(finalizacion.getCampoAdicional());
        orden.setFirmaCliente(finalizacion.getFirmaCliente());
        
        // MAPEAR LOS 20 CAMPOS DEL CHECKLIST CON NOMBRES EXACTOS DE TU ENTIDAD
        if (finalizacion.getChecklist() != null) {
            Map<String, String> checklist = finalizacion.getChecklist();
            
            // 1. Cambio rodamiento
            String rodamiento = checklist.getOrDefault("cambioRodamientos", "NO");
            orden.setCambioRodamientos(com.hidro.manh.enums.EstadoMantenimiento.valueOf(rodamiento));
            
            // 2. Cambio sello
            String sello = checklist.getOrDefault("cambioSello", "NO");
            orden.setCambioSello(com.hidro.manh.enums.EstadoMantenimiento.valueOf(sello));
            
            // 3. Cambio voluta
            String voluta = checklist.getOrDefault("cambioVoluta", "NO");
            orden.setCambioVoluta(com.hidro.manh.enums.EstadoMantenimiento.valueOf(voluta));
            
            // 4. Rebobino campos
            String rebobinado = checklist.getOrDefault("rebobinoCampos", "NO");
            orden.setRebobinoCampos(com.hidro.manh.enums.EstadoMantenimiento.valueOf(rebobinado));
            
            // 5. Protecciones saltadas
            String proteccionesSaltadas = checklist.getOrDefault("proteccionesSaltadas", "NO");
            orden.setProteccionesSaltadas(com.hidro.manh.enums.EstadoMantenimiento.valueOf(proteccionesSaltadas));
            
            // 6. Cambio protecciones
            String cambioProtecciones = checklist.getOrDefault("cambioProtecciones", "NO");
            orden.setCambioProtecciones(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioProtecciones));
            
            // 7. Contactores quemados
            String contactoresQuemados = checklist.getOrDefault("contactoresQuemados", "NO");
            orden.setContactoresQuemados(com.hidro.manh.enums.EstadoMantenimiento.valueOf(contactoresQuemados));
            
            // 8. Cambio contactores
            String cambioContactores = checklist.getOrDefault("cambioContactores", "NO");
            orden.setCambioContactores(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioContactores));
            
            // 9. Cambio luces piloto
            String cambioLucesPiloto = checklist.getOrDefault("cambioLucesPiloto", "NO");
            orden.setCambioLucesPiloto(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioLucesPiloto));
            
            // 10. Limpio tablero
            String limpiezaTablero = checklist.getOrDefault("limpioTablero", "NO");
            orden.setLimpioTablero(com.hidro.manh.enums.EstadoMantenimiento.valueOf(limpiezaTablero));
            
            // 11. Cambio presostato
            String cambioPresostato = checklist.getOrDefault("cambioPresostato", "NO");
            orden.setCambioPresostato(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioPresostato));
            
            // 12. Cambio manometro
            String cambioManometro = checklist.getOrDefault("cambioManometro", "NO");
            orden.setCambioManometro(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioManometro));
            
            // 13. Cargo con aire EP
            String cargaAireEp = checklist.getOrDefault("cargoConAireEp", "NO");
            orden.setCargoConAireEp(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cargaAireEp));
            
            // 14. Reviso presion EP
            String revisionPresionEp = checklist.getOrDefault("revisoPresionEp", "NO");
            orden.setRevisoPresionEp(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionPresionEp));
            
            // 15. Cambio valv retencion
            String cambioValvulaRetencion = checklist.getOrDefault("cambioValvRetencion", "NO");
            orden.setCambioValvRetencion(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioValvulaRetencion));
            
            // 16. Suprimo filtracion
            String suprimirFiltracion = checklist.getOrDefault("suprimoFiltracion", "NO");
            orden.setSuprimoFiltracion(com.hidro.manh.enums.EstadoMantenimiento.valueOf(suprimirFiltracion));
            
            // 17. Reviso valv compuerta
            String revisionValvCompuerta = checklist.getOrDefault("revisoValvCompuerta", "NO");
            orden.setRevisoValvCompuerta(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionValvCompuerta));
            
            // 18. Reviso valv flotador
            String revisionValvFlotador = checklist.getOrDefault("revisoValvFlotador", "NO");
            orden.setRevisoValvFlotador(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionValvFlotador));
            
            // 19. Reviso estanque agua
            String revisionEstanqueAgua = checklist.getOrDefault("revisoEstanqueAgua", "NO");
            orden.setRevisoEstanqueAgua(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionEstanqueAgua));
            
            // 20. Reviso fittings otros
            String revisionFittingsOtros = checklist.getOrDefault("revisoFittingsOtros", "NO");
            orden.setRevisoFittingsOtros(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionFittingsOtros));
        }
        
        // Lecturas eléctricas - convertir Double a BigDecimal
        if (finalizacion.getLecturaR() != null) {
            orden.setR(BigDecimal.valueOf(finalizacion.getLecturaR()));
        }
        if (finalizacion.getLecturaS() != null) {
            orden.setS(BigDecimal.valueOf(finalizacion.getLecturaS()));
        }
        if (finalizacion.getLecturaT() != null) {
            orden.setT(BigDecimal.valueOf(finalizacion.getLecturaT()));
        }
        if (finalizacion.getVoltaje() != null) {
            orden.setVoltaje(BigDecimal.valueOf(finalizacion.getVoltaje()));
        }
        
        return ordenMantenimientoRepository.save(orden);
    }

    // MÉTODOS DE CONSULTA ESPECÍFICOS
    public OrdenMantenimiento findUltimaByClienteId(Long clienteId) {
        return ordenMantenimientoRepository
            .findTopByIdMotorUbicacionClienteIdClienteOrderByHoraIngresoDesc(clienteId)
            .orElseThrow(() -> new RuntimeException("No se encontraron mantenciones para el cliente"));
    }

    public List<OrdenReparacion> findReparaciones30DiasByClienteId(Long clienteId) {
        Date hace30Dias = java.sql.Timestamp.valueOf(LocalDateTime.now().minusDays(30));
        return ordenReparacionRepository.findByIdMotorUbicacionClienteIdClienteAndFechaAfter(clienteId, hace30Dias);
    }

    public List<OrdenMantenimiento> findByTecnicoId(Long tecnicoId) {
        return ordenMantenimientoRepository.findByIdTecnicoIdUsuario(tecnicoId);
    }

    public List<OrdenMantenimiento> findByHoraSalidaIsNull() {
        return ordenMantenimientoRepository.findByHoraSalidaIsNull();
    }

    // MÉTODOS ADICIONALES
    public Optional<OrdenMantenimiento> findByEquipoId(Long equipoId) {
        return ordenMantenimientoRepository.findById(equipoId);
    }

    public List<OrdenMantenimiento> findByFechaRange(Date fechaInicio, Date fechaFin) {
        return ordenMantenimientoRepository.findByHoraIngresoBetween(fechaInicio, fechaFin);
    }

    public Long countByClienteId(Long clienteId) {
        return ordenMantenimientoRepository.countByIdMotorUbicacionClienteIdCliente(clienteId);
    }

    public Long countByTecnicoId(Long tecnicoId) {
        return ordenMantenimientoRepository.countByIdTecnicoIdUsuario(tecnicoId);
    }
}