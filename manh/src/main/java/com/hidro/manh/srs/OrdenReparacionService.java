package com.hidro.manh.srs;

import com.hidro.manh.ety.OrdenReparacion;
import com.hidro.manh.enums.ProgresoReparacion;
import com.hidro.manh.rep.OrdenReparacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenReparacionService {

    @Autowired
    private OrdenReparacionRepository ordenReparacionRepository;

    // MÉTODOS FALTANTES CORREGIDOS
    public Optional<OrdenReparacion> findById(Long id) {
        return ordenReparacionRepository.findById(id);
    }
    
    public List<OrdenReparacion> findAll() {
        return ordenReparacionRepository.findAll();
    }
    
    public void deleteById(Long id) {
        ordenReparacionRepository.deleteById(id);
    }
    
    // MÉTODO CORREGIDO - USANDO ENUM DIRECTAMENTE
    public OrdenReparacion actualizarProgreso(Long id, ProgresoReparacion progreso) {
        OrdenReparacion orden = ordenReparacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Orden de reparación no encontrada"));
        
        orden.setProgreso(progreso);
        return ordenReparacionRepository.save(orden);
    }
    
    // MÉTODO PARA CONVERTIR STRING A ENUM
    public OrdenReparacion actualizarProgresoFromString(Long id, String progresoStr) {
        ProgresoReparacion progreso;
        try {
            progreso = ProgresoReparacion.valueOf(progresoStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Valor de progreso inválido: " + progresoStr);
        }
        return actualizarProgreso(id, progreso);
    }

    // MÉTODOS EXISTENTES
    public List<OrdenReparacion> findByEquipoUbicacionClienteIdCliente(Long clienteId) {
        return ordenReparacionRepository.findByEquipoUbicacionClienteIdCliente(clienteId);
    }
    
    public OrdenReparacion save(OrdenReparacion ordenReparacion) {
        return ordenReparacionRepository.save(ordenReparacion);
    }
}