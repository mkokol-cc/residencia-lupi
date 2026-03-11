package com.residencia.api.controllers;

import com.residencia.api.models.TipoOperacion;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.TipoOperacionService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-operacion")
@CrossOrigin("*")
public class TipoOperacionController extends GenericController<TipoOperacion, TipoOperacion, Long> {

    @Autowired
    private TipoOperacionService tipoOperacionService;

    @Override
    protected GenericService<TipoOperacion, TipoOperacion, Long> getService() {
        return tipoOperacionService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TipoOperacion>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {

        Specification<TipoOperacion> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nombre")), "%" + search.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return ResponseEntity.ok(tipoOperacionService.search(spec, pageable));
    }
}