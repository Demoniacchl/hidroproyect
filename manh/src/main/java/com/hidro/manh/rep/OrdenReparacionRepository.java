package com.hidro.manh.rep;

import com.hidro.manh.ety.OrdenReparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenReparacionRepository extends JpaRepository<OrdenReparacion, Long> {
    
    // MÉTODOS FALTANTES
    List<OrdenReparacion> findByEquipoUbicacionClienteIdCliente(Long clienteId);
}