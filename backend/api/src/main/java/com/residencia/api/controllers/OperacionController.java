package com.residencia.api.controllers;

import com.residencia.api.models.Operacion;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.OperacionService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/operaciones")
@CrossOrigin("*")
public class OperacionController extends GenericController<Operacion, Operacion, Long> {

    @Autowired
    private OperacionService operacionService;

    @Override
    protected GenericService<Operacion, Operacion, Long> getService() {
        return operacionService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Operacion>> search(
            @RequestParam(required = false) Long entidadId,
            @RequestParam(required = false) Long conceptoId,
            @RequestParam(required = false) Long tipoOperacionId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam(required = false) Double montoMin,
            @RequestParam(required = false) Double montoMax,
            Pageable pageable) {

        Specification<Operacion> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (entidadId != null) predicates.add(cb.equal(root.get("entidad").get("id"), entidadId));
            if (conceptoId != null) predicates.add(cb.equal(root.get("concepto").get("id"), conceptoId));
            if (tipoOperacionId != null) predicates.add(cb.equal(root.get("tipoOperacion").get("id"), tipoOperacionId));
            if (fechaInicio != null) predicates.add(cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio));
            if (fechaFin != null) {
                // Ajusta la fecha de fin para que incluya todo el día
                predicates.add(cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin.with(LocalTime.MAX)));
            }
            if (montoMin != null) predicates.add(cb.greaterThanOrEqualTo(root.get("monto"), montoMin));
            if (montoMax != null) predicates.add(cb.lessThanOrEqualTo(root.get("monto"), montoMax));
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return ResponseEntity.ok(operacionService.search(spec, pageable));
    }
}