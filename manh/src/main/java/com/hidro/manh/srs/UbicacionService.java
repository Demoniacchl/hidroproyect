package com.hidro.manh.srs;

import com.hidro.manh.ety.Ubicacion;
import com.hidro.manh.rep.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UbicacionService {

    @Autowired
    private UbicacionRepository ubicacionRepository;

    // Todas las ubicaciones
    public List<Ubicacion> getAllUbicaciones() {
        return ubicacionRepository.findAll();
    }

    // Ubicaciones filtradas por región
    public List<Ubicacion> getUbicacionesByRegion(Integer regionId) {
        return ubicacionRepository.findByRegionId(regionId);
    }

    // Ubicaciones filtradas por comuna
    public List<Ubicacion> getUbicacionesByComuna(Integer comunaId) {
        return ubicacionRepository.findByComunaId(comunaId);
    }

    // Ubicación específica
    public Optional<Ubicacion> getUbicacionById(Long idUbicacion) {
        return ubicacionRepository.findById(idUbicacion);
    }

    // Guardar o actualizar ubicación
    public Ubicacion saveUbicacion(Ubicacion ubicacion) {
        return ubicacionRepository.save(ubicacion);
    }

    // Eliminar ubicación
    public void deleteUbicacion(Long idUbicacion) {
        ubicacionRepository.deleteById(idUbicacion);
    }
}
