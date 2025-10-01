package com.hidro.manh.ctrl;

import com.hidro.manh.dto.RegionDto;
import com.hidro.manh.srs.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/regiones")
@RequiredArgsConstructor
public class RegionCtrl {
    private final RegionService service;
    @GetMapping public List<RegionDto> all() { return service.getAll(); }
}
