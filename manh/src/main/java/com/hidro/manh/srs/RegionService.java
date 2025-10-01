package com.hidro.manh.srs;

import com.hidro.manh.dto.RegionDto;
import com.hidro.manh.rep.RegionRep;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegionService {
    private final RegionRep rep;
    public List<RegionDto> getAll() {
        return rep.findAll().stream().map(r -> RegionDto.builder().id(r.getId()).region(r.getRegion()).build()).collect(Collectors.toList());
    }
}
