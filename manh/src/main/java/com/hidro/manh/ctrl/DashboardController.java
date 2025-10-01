package com.hidro.manh.ctrl;

import com.hidro.manh.dto.DashboardEstadisticasDTO;
import com.hidro.manh.dto.AlertaDTO;
import com.hidro.manh.srs.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/estadisticas")
    public ResponseEntity<DashboardEstadisticasDTO> getEstadisticas() {
        try {
            DashboardEstadisticasDTO estadisticas = dashboardService.getEstadisticas();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/alertas")
    public ResponseEntity<List<AlertaDTO>> getAlertas() {
        try {
            List<AlertaDTO> alertas = dashboardService.getAlertas();
            return ResponseEntity.ok(alertas);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/proximas-mantenciones")
    public ResponseEntity<List<Object>> getProximasMantenciones() {
        try {
            List<Object> proximasMantenciones = dashboardService.getProximasMantenciones();
            return ResponseEntity.ok(proximasMantenciones);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/ordenes-pendientes")
    public ResponseEntity<List<Object>> getOrdenesPendientes() {
        try {
            List<Object> ordenesPendientes = dashboardService.getOrdenesPendientes();
            return ResponseEntity.ok(ordenesPendientes);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
}