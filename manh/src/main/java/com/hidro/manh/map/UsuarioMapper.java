package com.hidro.manh.map;

import org.mapstruct.*;
import com.hidro.manh.ety.Usuario;
import com.hidro.manh.dto.UsuarioDto;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioDto toDto(Usuario entity);
    Usuario toEntity(UsuarioDto dto);
}
