package com.hidro.manh.ctrl;

import com.hidro.manh.ety.Ubicacion;
import com.hidro.manh.srs.UbicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ubicaciones")
public class UbicacionController {

    @Autowired
    private UbicacionService ubicacionService;

    // Listar todas las ubicaciones
    @GetMapping
    public List<Ubicacion> getAllUbicaciones() {
        return ubicacionService.getAllUbicaciones();
    }

    // Filtrar por región
    @GetMapping("/region/{regionId}")
    public List<Ubicacion> getUbicacionesByRegion(@PathVariable Integer regionId) {
        return ubicacionService.getUbicacionesByRegion(regionId);
    }

    // Filtrar por comuna
    @GetMapping("/comuna/{comunaId}")
    public List<Ubicacion> getUbicacionesByComuna(@PathVariable Integer comunaId) {
        return ubicacionService.getUbicacionesByComuna(comunaId);
    }

    // Obtener ubicación específica
    @GetMapping("/{id}")
    public Optional<Ubicacion> getUbicacion(@PathVariable Long id) {
        return ubicacionService.getUbicacionById(id);
    }

    // Crear o actualizar ubicación
    @PostMapping
    public Ubicacion saveUbicacion(@RequestBody Ubicacion ubicacion) {
        return ubicacionService.saveUbicacion(ubicacion);
    }

    // Eliminar ubicación
    @DeleteMapping("/{id}")
    public void deleteUbicacion(@PathVariable Long id) {
        ubicacionService.deleteUbicacion(id);
    }
}
