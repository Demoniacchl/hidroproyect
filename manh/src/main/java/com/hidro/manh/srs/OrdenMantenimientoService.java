package com.hidro.manh.srs;

import com.hidro.manh.ety.OrdenMantenimiento;
import com.hidro.manh.ety.EquipoMotor;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.dto.OrdenMantenimientoDto;
import com.hidro.manh.enums.EstadoMantenimiento;
import com.hidro.manh.enums.TipoOrden;
import com.hidro.manh.rep.OrdenMantenimientoRepository;
import com.hidro.manh.rep.EquipoMotorRepository;
import com.hidro.manh.rep.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenMantenimientoService {

    @Autowired
    private OrdenMantenimientoRepository ordenMantenimientoRepository;
    
    @Autowired
    private EquipoMotorRepository equipoMotorRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // MÉTODOS FALTANTES QUE CAUSAN ERRORES
    public List<OrdenMantenimiento> getAll() {
        return ordenMantenimientoRepository.findAll();
    }
    
    public Optional<OrdenMantenimiento> getById(Long id) {
        return ordenMantenimientoRepository.findById(id);
    }
    
    public void delete(Long id) {
        ordenMantenimientoRepository.deleteById(id);
    }
    
    public OrdenMantenimiento save(OrdenMantenimiento entity) {
        return ordenMantenimientoRepository.save(entity);
    }

    // MÉTODO DE CONVERSIÓN DTO A ENTITY CON GETTERS/SETTERS EXACTOS
    public OrdenMantenimiento convertToEntity(OrdenMantenimientoDto dto) {
        OrdenMantenimiento entity = new OrdenMantenimiento();
        
        // CAMPOS BÁSICOS
        entity.setIdOrden(dto.getIdOrden());
        entity.setHoraIngreso(dto.getHoraIngreso());
        entity.setHoraSalida(dto.getHoraSalida());
        entity.setObservaciones(dto.getObservaciones());
        entity.setFirmaCliente(dto.getFirmaCliente());
        entity.setTipoOrden(dto.getTipoOrden());
        entity.setCampoAdicional(dto.getCampoAdicional());
        
        // LECTURAS ELÉCTRICAS
        entity.setR(dto.getR());
        entity.setS(dto.getS());
        entity.setT(dto.getT());
        entity.setVoltaje(dto.getVoltaje());
        
        // CHECKLIST - 20 PUNTOS CON GETTERS EXACTOS
        entity.setCambioRodamientos(dto.getCambioRodamientos());
        entity.setCambioSello(dto.getCambioSello());
        entity.setCambioVoluta(dto.getCambioVoluta());
        entity.setRebobinoCampos(dto.getRebobinoCampos());
        entity.setProteccionesSaltadas(dto.getProteccionesSaltadas());
        entity.setCambioProtecciones(dto.getCambioProtecciones());
        entity.setContactoresQuemados(dto.getContactoresQuemados());
        entity.setCambioContactores(dto.getCambioContactores());
        entity.setCambioLucesPiloto(dto.getCambioLucesPiloto());
        entity.setLimpioTablero(dto.getLimpioTablero());
        entity.setCambioPresostato(dto.getCambioPresostato());
        entity.setCambioManometro(dto.getCambioManometro());
        entity.setCargoConAireEp(dto.getCargoConAireEp());
        entity.setRevisoPresionEp(dto.getRevisoPresionEp());
        entity.setCambioValvRetencion(dto.getCambioValvRetencion());
        entity.setSuprimoFiltracion(dto.getSuprimoFiltracion());
        entity.setRevisoValvCompuerta(dto.getRevisoValvCompuerta());
        entity.setRevisoValvFlotador(dto.getRevisoValvFlotador());
        entity.setRevisoEstanqueAgua(dto.getRevisoEstanqueAgua());
        entity.setRevisoFittingsOtros(dto.getRevisoFittingsOtros());
        
        // RELACIONES FK
        if (dto.getIdMotor() != null) {
            EquipoMotor motor = equipoMotorRepository.findById(dto.getIdMotor())
                .orElseThrow(() -> new RuntimeException("Motor no encontrado"));
            entity.setMotor(motor);
        }
        
        if (dto.getIdTecnico() != null) {
            Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico())
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
            entity.setTecnico(tecnico);
        }
        
        return entity;
    }

    // MÉTODO PARA CONVERTIR ENTITY A DTO (SI SE NECESITA)
    public OrdenMantenimientoDto convertToDto(OrdenMantenimiento entity) {
        return OrdenMantenimientoDto.builder()
            .idOrden(entity.getIdOrden())
            .idMotor(entity.getMotor() != null ? entity.getMotor().getIdMotor() : null)
            .idTecnico(entity.getTecnico() != null ? entity.getTecnico().getIdUsuario() : null)
            .horaIngreso(entity.getHoraIngreso())
            .horaSalida(entity.getHoraSalida())
            .r(entity.getR())
            .s(entity.getS())
            .t(entity.getT())
            .voltaje(entity.getVoltaje())
            .observaciones(entity.getObservaciones())
            .firmaCliente(entity.getFirmaCliente())
            .tipoOrden(entity.getTipoOrden())
            .campoAdicional(entity.getCampoAdicional())
            .cambioRodamientos(entity.getCambioRodamientos())
            .cambioSello(entity.getCambioSello())
            .cambioVoluta(entity.getCambioVoluta())
            .rebobinoCampos(entity.getRebobinoCampos())
            .proteccionesSaltadas(entity.getProteccionesSaltadas())
            .cambioProtecciones(entity.getCambioProtecciones())
            .contactoresQuemados(entity.getContactoresQuemados())
            .cambioContactores(entity.getCambioContactores())
            .cambioLucesPiloto(entity.getCambioLucesPiloto())
            .limpioTablero(entity.getLimpioTablero())
            .cambioPresostato(entity.getCambioPresostato())
            .cambioManometro(entity.getCambioManometro())
            .cargoConAireEp(entity.getCargoConAireEp())
            .revisoPresionEp(entity.getRevisoPresionEp())
            .cambioValvRetencion(entity.getCambioValvRetencion())
            .suprimoFiltracion(entity.getSuprimoFiltracion())
            .revisoValvCompuerta(entity.getRevisoValvCompuerta())
            .revisoValvFlotador(entity.getRevisoValvFlotador())
            .revisoEstanqueAgua(entity.getRevisoEstanqueAgua())
            .revisoFittingsOtros(entity.getRevisoFittingsOtros())
            .build();
    }

    // MÉTODOS EXISTENTES
    public List<OrdenMantenimiento> findByHoraIngresoBetween(java.util.Date start, java.util.Date end) {
        return ordenMantenimientoRepository.findByHoraIngresoBetween(start, end);
    }
    
    public List<OrdenMantenimiento> findByMotor(EquipoMotor motor) {
        return ordenMantenimientoRepository.findByMotor(motor);
    }
    
    public List<OrdenMantenimiento> findByTecnico(Usuario tecnico) {
        return ordenMantenimientoRepository.findByTecnico(tecnico);
    }
}