package com.hidro.manh.ctrl;

import com.hidro.manh.srs.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {
    
    @Autowired
    private ReporteService reporteService;
    
    @GetMapping("/mantenciones")
    public ResponseEntity<List<Map<String, Object>>> getReporteMantenciones(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        try {
            List<Map<String, Object>> reporte = reporteService.generarReporteMantenciones(fechaInicio, fechaFin);
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/clientes")
    public ResponseEntity<List<Map<String, Object>>> getReporteClientes() {
        try {
            List<Map<String, Object>> reporte = reporteService.generarReporteClientes();
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/tecnicos")
    public ResponseEntity<List<Map<String, Object>>> getReporteTecnicos() {
        try {
            List<Map<String, Object>> reporte = reporteService.generarReporteTecnicos();
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/equipos")
    public ResponseEntity<List<Map<String, Object>>> getReporteEquipos() {
        try {
            List<Map<String, Object>> reporte = reporteService.generarReporteEquipos();
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
}