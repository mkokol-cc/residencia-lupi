package com.residencia.api.controllers;

import com.residencia.api.models.MovimientoSaldo;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.MovimientoSaldoService;
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
@RequestMapping("/api/movimientos-saldo")
@CrossOrigin("*")
public class MovimientoSaldoController extends GenericController<MovimientoSaldo, MovimientoSaldo, Long> {

    @Autowired
    private MovimientoSaldoService movimientoSaldoService;

    @Override
    protected GenericService<MovimientoSaldo, MovimientoSaldo, Long> getService() {
        return movimientoSaldoService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MovimientoSaldo>> search(
            @RequestParam(required = false) Long entidadId,
            @RequestParam(required = false) Long conceptoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.util.Date fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.util.Date fechaFin,
            @RequestParam(required = false) Double montoMin,
            @RequestParam(required = false) Double montoMax,
            Pageable pageable) {


        Specification<MovimientoSaldo> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (entidadId != null) predicates.add(cb.equal(root.get("entidad").get("id"), entidadId));
            if (conceptoId != null) predicates.add(cb.equal(root.get("concepto").get("id"), conceptoId));
            if (fechaInicio != null) predicates.add(cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio));
            if (fechaFin != null) predicates.add(cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin));
            if (montoMin != null) predicates.add(cb.greaterThanOrEqualTo(root.get("monto"), montoMin));
            if (montoMax != null) predicates.add(cb.lessThanOrEqualTo(root.get("monto"), montoMax));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return ResponseEntity.ok(movimientoSaldoService.search(spec, pageable));
    }
}