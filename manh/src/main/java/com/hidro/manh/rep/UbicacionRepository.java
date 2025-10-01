package com.hidro.manh.rep;

import com.hidro.manh.ety.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
List<Ubicacion> findByCliente_IdCliente(Long idCliente);
    List<Ubicacion> findByRegionId(Integer regionId);
    List<Ubicacion> findByComunaId(Integer comunaId);
}
