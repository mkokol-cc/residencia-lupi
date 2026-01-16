package com.residencia.api.controllers;

import com.residencia.api.models.Entidad;
import com.residencia.api.services.EntidadService;
import com.residencia.api.services.GenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entidades")
@CrossOrigin("*")
public class EntidadController extends GenericController<Entidad, Entidad, Long> {

    @Autowired
    private EntidadService entidadService;

    @Override
    protected GenericService<Entidad, Entidad, Long> getService() {
        return entidadService;
    }
}