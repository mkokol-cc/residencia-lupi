package com.residencia.api.controllers;

import com.residencia.api.models.Concepto;
import com.residencia.api.services.ConceptoService;
import com.residencia.api.services.GenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conceptos")
@CrossOrigin("*")
public class ConceptoController extends GenericController<Concepto, Concepto, Long> {

    @Autowired
    private ConceptoService conceptoService;

    @Override
    protected GenericService<Concepto, Concepto, Long> getService() {
        return conceptoService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Concepto>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(conceptoService.searchConceptos(search, pageable));
    }
}