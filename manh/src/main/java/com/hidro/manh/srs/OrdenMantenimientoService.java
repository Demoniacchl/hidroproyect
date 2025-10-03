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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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

    // MÉTODOS CRUD
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

    // MÉTODOS DE CONVERSIÓN DTO - ENTITY
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
        
        // CHECKLIST - 20 PUNTOS
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

    // MÉTODOS DE CONSULTA PARA EL FRONTEND
    public List<OrdenMantenimiento> getByMotorId(Long motorId) {
        return ordenMantenimientoRepository.findByMotorIdMotor(motorId);
    }
    
    public List<OrdenMantenimiento> getByRangoFechas(String inicioStr, String finStr) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date inicio = format.parse(inicioStr);
            Date fin = format.parse(finStr);
            
            // Ajustar fin para que incluya todo el día
            Calendar cal = Calendar.getInstance();
            cal.setTime(fin);
            cal.add(Calendar.DAY_OF_MONTH, 1);
            fin = cal.getTime();
            
            return ordenMantenimientoRepository.findByRangoFechas(inicio, fin);
        } catch (ParseException e) {
            throw new RuntimeException("Formato de fecha inválido. Use yyyy-MM-dd", e);
        }
    }
    
    public List<OrdenMantenimiento> getByClienteId(Long clienteId) {
        return ordenMantenimientoRepository.findByClienteId(clienteId);
    }

    // MÉTODOS EXISTENTES
    public List<OrdenMantenimiento> findByHoraIngresoBetween(Date start, Date end) {
        return ordenMantenimientoRepository.findByHoraIngresoBetween(start, end);
    }
    
    public List<OrdenMantenimiento> findByMotor(EquipoMotor motor) {
        return ordenMantenimientoRepository.findByMotor(motor);
    }
    
    public List<OrdenMantenimiento> findByTecnico(Usuario tecnico) {
        return ordenMantenimientoRepository.findByTecnico(tecnico);
    }
}