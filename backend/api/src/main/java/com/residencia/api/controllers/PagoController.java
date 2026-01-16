package com.residencia.api.controllers;

import com.residencia.api.models.Pago;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.PagoService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin("*")
public class PagoController extends GenericController<Pago, Pago, Long> {

    @Autowired
    private PagoService pagoService;

    @Override
    protected GenericService<Pago, Pago, Long> getService() {
        return pagoService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Pago>> search(
        @RequestParam(required = false) Long entidadId,
        @RequestParam(required = false) Long metodoId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.util.Date fechaInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.util.Date fechaFin,
        @RequestParam(required = false) Double montoMin,
        @RequestParam(required = false) Double montoMax,
        Pageable pageable) {

        Specification<Pago> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (entidadId != null) predicates.add(cb.equal(root.get("entidad").get("id"), entidadId));
            if (metodoId != null) predicates.add(cb.equal(root.get("metodo").get("id"), metodoId));
            if (fechaInicio != null) predicates.add(cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio));
            if (fechaFin != null) predicates.add(cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin));
            if (montoMin != null) predicates.add(cb.greaterThanOrEqualTo(root.get("monto"), montoMin));
            if (montoMax != null) predicates.add(cb.lessThanOrEqualTo(root.get("monto"), montoMax));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return ResponseEntity.ok(pagoService.search(spec, pageable));
    }
}