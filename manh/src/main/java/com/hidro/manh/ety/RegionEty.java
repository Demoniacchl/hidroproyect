package com.hidro.manh.ety;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "regiones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RegionEty {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "region", nullable = false, length = 100)
    private String region;
}
