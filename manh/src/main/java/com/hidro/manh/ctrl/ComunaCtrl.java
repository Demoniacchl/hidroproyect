package com.hidro.manh.ctrl;

import com.hidro.manh.dto.ComunaDto;
import com.hidro.manh.srs.ComunaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comunas")
@RequiredArgsConstructor
public class ComunaCtrl {
    private final ComunaService service;
    @GetMapping("/{regionId}") public List<ComunaDto> byRegion(@PathVariable Integer regionId) { return service.getByRegion(regionId); }
}
