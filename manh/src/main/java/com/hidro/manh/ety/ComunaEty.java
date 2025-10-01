package com.hidro.manh.ety;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comunas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ComunaEty {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "comuna", nullable = false, length = 250)
    private String comuna;

    @Column(name = "region_id", nullable = false)
    private Integer regionId;
}
