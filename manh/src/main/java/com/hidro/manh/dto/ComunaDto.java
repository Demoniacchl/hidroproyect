package com.hidro.manh.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ComunaDto {
    private Integer id;
    private String comuna;
    private Integer regionId;
}
