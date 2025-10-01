package com.hidro.manh.rep;

import com.hidro.manh.ety.Calendario;
import com.hidro.manh.enums.TipoEvento;
import com.hidro.manh.enums.EstadoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarioRepository extends JpaRepository<Calendario, Long> {
    
    List<Calendario> findByFechaInicioBetween(LocalDateTime start, LocalDateTime end);
    
    List<Calendario> findByTecnicoIdUsuario(Long idTecnico);
    
    List<Calendario> findByTipoEvento(TipoEvento tipoEvento);
    
    List<Calendario> findByEstado(EstadoEvento estado);
    
    List<Calendario> findByNotificadoFalseAndFechaInicioBetween(LocalDateTime now, LocalDateTime future);
    
    @Query("SELECT c FROM Calendario c WHERE c.cliente.idCliente = :clienteId")
    List<Calendario> findByClienteId(@Param("clienteId") Long clienteId);
    
    @Query("SELECT c FROM Calendario c WHERE c.tipoEvento = 'MANTENCION' AND c.estado = 'PROGRAMADO' AND c.fechaInicio > :now ORDER BY c.fechaInicio")
    List<Calendario> findProximasMantenciones(@Param("now") LocalDateTime now);
}