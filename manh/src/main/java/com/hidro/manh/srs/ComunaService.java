package com.hidro.manh.srs;

import com.hidro.manh.dto.ComunaDto;
import com.hidro.manh.rep.ComunaRep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComunaService {
    private final ComunaRep rep;
    public List<ComunaDto> getByRegion(Integer regionId) {
        return rep.findByRegionId(regionId).stream().map(c -> ComunaDto.builder().id(c.getId()).comuna(c.getComuna()).regionId(c.getRegionId()).build()).collect(Collectors.toList());
    }
}
