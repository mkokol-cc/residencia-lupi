package com.residencia.api.controllers;

import com.residencia.api.models.MetodoPago;
import com.residencia.api.services.GenericService;
import com.residencia.api.services.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metodos-pago")
@CrossOrigin("*")
public class MetodoPagoController extends GenericController<MetodoPago, MetodoPago, Long> {

    @Autowired
    private MetodoPagoService metodoPagoService;

    @Override
    protected GenericService<MetodoPago, MetodoPago, Long> getService() {
        return metodoPagoService;
    }
}