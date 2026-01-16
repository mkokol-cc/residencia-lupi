package com.residencia.api.controllers;

import com.residencia.api.dtos.ProveedorDTO;
import com.residencia.api.models.Proveedor;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.ProveedorService;
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
@RequestMapping("/api/proveedores")
@CrossOrigin("*")
public class ProveedorController extends GenericController<Proveedor, Proveedor, Long> {

    @Autowired
    private ProveedorService proveedorService;

    @Override
    protected GenericService<Proveedor, Proveedor, Long> getService() {
        return proveedorService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProveedorDTO>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(proveedorService.searchProveedores(search, pageable));
    }
}