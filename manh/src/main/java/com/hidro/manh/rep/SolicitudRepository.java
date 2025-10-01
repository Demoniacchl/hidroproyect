package com.hidro.manh.rep;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hidro.manh.ety.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {}
