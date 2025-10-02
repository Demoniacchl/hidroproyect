package com.hidro.manh.ctrl;

import com.hidro.manh.dto.DashboardEstadisticasDTO;
import com.hidro.manh.dto.AlertaDTO;
import com.hidro.manh.srs.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/solicitudes-por-estado")
    public ResponseEntity<List<Map<String, Object>>> getSolicitudesPorEstado() {
        try {
            List<Map<String, Object>> data = dashboardService.getSolicitudesPorEstado();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Los otros endpoints que mencionan los errores también necesitan corrección
    @GetMapping("/metricas-generales")
    public ResponseEntity<Map<String, Object>> getMetricasGenerales() {
        Map<String, Object> metricas = new HashMap<>();
        
        // Asegúrate de que todos los valores sean tipos compatibles
        metricas.put("totalSolicitudes", dashboardService.getTotalSolicitudes());
        metricas.put("solicitudesPendientes", dashboardService.getSolicitudesPendientes());
        metricas.put("mantencionesEsteMes", dashboardService.getMantencionesEsteMes());
        
        return ResponseEntity.ok(metricas);
    }
}