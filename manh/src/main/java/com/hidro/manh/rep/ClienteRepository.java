package com.hidro.manh.rep;

import com.hidro.manh.ety.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Lista de clientes con sus ubicaciones
    @Query("SELECT DISTINCT c FROM Cliente c LEFT JOIN FETCH c.ubicaciones u LEFT JOIN u.region r LEFT JOIN u.comuna cm")
    Page<Cliente> findAllWithUbicaciones(Pageable pageable);
   
    // ✅ AGREGA ESTE MÉTODO FALTANTE
    Optional<Cliente> findByNcliente(Integer ncliente);

    // Clientes filtrados por región
    @Query("SELECT DISTINCT c FROM Cliente c LEFT JOIN c.ubicaciones u WHERE u.regionId = :regionId")
    Page<Cliente> findAllByRegion(@Param("regionId") Integer regionId, Pageable pageable);

    // Clientes filtrados por comuna
    @Query("SELECT DISTINCT c FROM Cliente c LEFT JOIN c.ubicaciones u WHERE u.comunaId = :comunaId")
    Page<Cliente> findAllByComuna(@Param("comunaId") Integer comunaId, Pageable pageable);

    // Buscar cliente específico por ID con sus ubicaciones
    @Query("SELECT DISTINCT c FROM Cliente c LEFT JOIN FETCH c.ubicaciones u LEFT JOIN u.region r LEFT JOIN u.comuna cm WHERE c.idCliente = :idCliente")
    Optional<Cliente> findByIdWithUbicaciones(@Param("idCliente") Long idCliente);
}