package com.residencia.api.controllers;

import com.residencia.api.services.GenericService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

public abstract class GenericController<T, D, ID extends Serializable> {

    protected abstract GenericService<T, D, ID> getService();

    @GetMapping
    public ResponseEntity<List<D>> getAll() {
        return ResponseEntity.ok(getService().findAll());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<D>> getAllPaged(Pageable pageable) {
        return ResponseEntity.ok(getService().findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<D> getOne(@PathVariable ID id) {
        return getService().findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<D> create(@RequestBody D dto) {
        return ResponseEntity.ok(getService().save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<D> update(@PathVariable ID id, @RequestBody D dto) {
        // Aquí podrías agregar validaciones extra si el ID del body no coincide con el path
        return ResponseEntity.ok(getService().save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        getService().deleteById(id);
        return ResponseEntity.ok().build();
    }
}