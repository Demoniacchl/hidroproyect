package com.hidro.manh.srs;

import com.hidro.manh.dto.OrdenInicioDTO;
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
        ordenMantenimiento.setCampoAdicionalA(ordenMantenimientoDetails.getCampoAdicionalA());
        
        // Actualizar lecturas eléctricas
        ordenMantenimiento.setR(ordenMantenimientoDetails.getR());
        ordenMantenimiento.setS(ordenMantenimientoDetails.getS());
        ordenMantenimiento.setT(ordenMantenimientoDetails.getT());
        ordenMantenimiento.setVoltaje(ordenMantenimientoDetails.getVoltaje());
        
        // Actualizar relaciones
        if (ordenMantenimientoDetails.getIdMotor() != null) {
            ordenMantenimiento.setIdMotor(ordenMantenimientoDetails.getIdMotor());
        }
        if (ordenMantenimientoDetails.getIdTecnico() != null) {
            ordenMantenimiento.setIdTecnico(ordenMantenimientoDetails.getIdTecnico());
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
        orden.setIdMotor(equipo);
        orden.setIdTecnico(tecnico);
        
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
        
        // MAPEAR LOS 20 CAMPOS DEL CHECKLIST COMPLETOS
        if (finalizacion.getChecklist() != null) {
            Map<String, String> checklist = finalizacion.getChecklist();
            
            // 1. Rodamiento
            String rodamiento = checklist.getOrDefault("cambioRodamientos", "NO");
            orden.setChecklist01Rodamiento(com.hidro.manh.enums.EstadoMantenimiento.valueOf(rodamiento));
            
            // 2. Sello
            String sello = checklist.getOrDefault("cambioSello", "NO");
            orden.setChecklist02Sello(com.hidro.manh.enums.EstadoMantenimiento.valueOf(sello));
            
            // 3. Voluta
            String voluta = checklist.getOrDefault("cambioVoluta", "NO");
            orden.setChecklist03Voluta(com.hidro.manh.enums.EstadoMantenimiento.valueOf(voluta));
            
            // 4. Rebobinado campos
            String rebobinado = checklist.getOrDefault("rebobinoCampos", "NO");
            orden.setChecklist04RebobinadoCampos(com.hidro.manh.enums.EstadoMantenimiento.valueOf(rebobinado));
            
            // 5. Protecciones saltadas
            String proteccionesSaltadas = checklist.getOrDefault("proteccionesSaltadas", "NO");
            orden.setChecklist05ProteccionesSaltadas(com.hidro.manh.enums.EstadoMantenimiento.valueOf(proteccionesSaltadas));
            
            // 6. Cambio protecciones
            String cambioProtecciones = checklist.getOrDefault("cambioProtecciones", "NO");
            orden.setChecklist06CambioProtecciones(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioProtecciones));
            
            // 7. Contactores quemados
            String contactoresQuemados = checklist.getOrDefault("contactoresQuemados", "NO");
            orden.setChecklist07ContactoresQuemados(com.hidro.manh.enums.EstadoMantenimiento.valueOf(contactoresQuemados));
            
            // 8. Cambio contactores
            String cambioContactores = checklist.getOrDefault("cambioContactores", "NO");
            orden.setChecklist08CambioContactores(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioContactores));
            
            // 9. Cambio luces piloto
            String cambioLucesPiloto = checklist.getOrDefault("cambioLucesPiloto", "NO");
            orden.setChecklist09CambioLucesPiloto(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioLucesPiloto));
            
            // 10. Limpieza tablero
            String limpiezaTablero = checklist.getOrDefault("limpioTablero", "NO");
            orden.setChecklist10LimpiezaTablero(com.hidro.manh.enums.EstadoMantenimiento.valueOf(limpiezaTablero));
            
            // 11. Cambio presostato
            String cambioPresostato = checklist.getOrDefault("cambioPresostato", "NO");
            orden.setChecklist11CambioPresostato(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioPresostato));
            
            // 12. Cambio manómetro
            String cambioManometro = checklist.getOrDefault("cambioManometro", "NO");
            orden.setChecklist12CambioManometro(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioManometro));
            
            // 13. Carga con aire E.P.
            String cargaAireEp = checklist.getOrDefault("cargoConAireEp", "NO");
            orden.setChecklist13CargaConAireEp(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cargaAireEp));
            
            // 14. Revisión presión E.P.
            String revisionPresionEp = checklist.getOrDefault("revisoPresionEp", "NO");
            orden.setChecklist14RevisionPresionEp(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionPresionEp));
            
            // 15. Cambio válvula retención
            String cambioValvulaRetencion = checklist.getOrDefault("cambioValvRetencion", "NO");
            orden.setChecklist15CambioValvRetencion(com.hidro.manh.enums.EstadoMantenimiento.valueOf(cambioValvulaRetencion));
            
            // 16. Suprimir filtración
            String suprimirFiltracion = checklist.getOrDefault("suprimoFiltracion", "NO");
            orden.setChecklist16SuprimirFiltracion(com.hidro.manh.enums.EstadoMantenimiento.valueOf(suprimirFiltracion));
            
            // 17. Revisión válvula compuerta
            String revisionValvCompuerta = checklist.getOrDefault("revisoValvCompuerta", "NO");
            orden.setChecklist17RevisionValvCompuerta(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionValvCompuerta));
            
            // 18. Revisión válvula flotador
            String revisionValvFlotador = checklist.getOrDefault("revisoValvFlotador", "NO");
            orden.setChecklist18RevisionValvFlotador(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionValvFlotador));
            
            // 19. Revisión estanque agua
            String revisionEstanqueAgua = checklist.getOrDefault("revisoEstanqueAgua", "NO");
            orden.setChecklist19RevisionEstanqueAgua(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionEstanqueAgua));
            
            // 20. Revisión fittings otros
            String revisionFittingsOtros = checklist.getOrDefault("revisoFittingsOtros", "NO");
            orden.setChecklist20RevisionFittingsOtros(com.hidro.manh.enums.EstadoMantenimiento.valueOf(revisionFittingsOtros));
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
    public List<OrdenMantenimiento> findByEquipoId(Long equipoId) {
        return ordenMantenimientoRepository.findByIdMotorIdMotor(equipoId);
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