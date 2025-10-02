package com.hidro.manh.rep;

import com.hidro.manh.enums.RolUsuario;
import com.hidro.manh.ety.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);
    List<Usuario> findByRol(RolUsuario rol);
}
