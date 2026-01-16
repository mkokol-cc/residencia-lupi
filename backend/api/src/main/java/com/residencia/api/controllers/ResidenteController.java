package com.residencia.api.controllers;

import com.residencia.api.dtos.ResidenteDTO;
import com.residencia.api.models.Residente;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.ResidenteService;
import com.residencia.api.specifications.GenericSpecification;
import com.residencia.api.specifications.SearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/residentes")
@CrossOrigin("*")
public class ResidenteController extends GenericController<Residente, Residente, Long> {

    @Autowired
    private ResidenteService residenteService;

    @Override
    protected GenericService<Residente, Residente, Long> getService() {
        return residenteService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ResidenteDTO>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(residenteService.searchResidentes(search, pageable));
    }
}