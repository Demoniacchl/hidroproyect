package com.hidro.manh.rep;

import com.hidro.manh.ety.ComunaEty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComunaRep extends JpaRepository<ComunaEty, Integer> {
    List<ComunaEty> findByRegionId(Integer regionId);
}
