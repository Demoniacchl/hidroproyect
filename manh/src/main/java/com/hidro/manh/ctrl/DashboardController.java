package com.hidro.manh.ctrl;

import com.hidro.manh.srs.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // ENDPOINT CORREGIDO - USANDO MÉTODOS QUE AHORA EXISTEN
    @GetMapping("/metricas")
    public ResponseEntity<Map<String, Object>> getMetricas() {
        try {
            Map<String, Object> metricas = new HashMap<>();
            
            // USANDO MÉTODOS QUE AHORA EXISTEN EN DashboardService
            metricas.put("totalSolicitudes", dashboardService.getTotalSolicitudes());
            metricas.put("solicitudesPendientes", dashboardService.getSolicitudesPendientes());
            metricas.put("mantencionesEsteMes", dashboardService.getMantencionesEsteMes());
            
            return ResponseEntity.ok(metricas);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener métricas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // MÉTODOS EXISTENTES CORREGIDOS
    @GetMapping("/solicitudes-por-estado")
    public ResponseEntity<List<Map<String, Object>>> getSolicitudesPorEstado() {
        try {
            List<Map<String, Object>> data = dashboardService.getSolicitudesPorEstado();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/eventos-proximos")
    public ResponseEntity<List<Map<String, Object>>> getEventosProximos() {
        try {
            List<Map<String, Object>> data = dashboardService.getEventosProximos();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/ordenes-recientes")
    public ResponseEntity<List<Map<String, Object>>> getOrdenesRecientes() {
        try {
            List<Map<String, Object>> data = dashboardService.getOrdenesMantenimientoRecientes();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}