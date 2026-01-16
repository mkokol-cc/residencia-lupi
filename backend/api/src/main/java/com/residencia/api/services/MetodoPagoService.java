package com.residencia.api.services;

import com.residencia.api.models.MetodoPago;
import com.residencia.api.repositories.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class MetodoPagoService extends GenericService<MetodoPago, MetodoPago, Long> {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Override
    protected JpaRepository<MetodoPago, Long> getRepository() {
        return metodoPagoRepository;
    }

    @Override
    protected MetodoPago toDTO(MetodoPago entity) {
        return entity;
    }

    @Override
    protected MetodoPago toEntity(MetodoPago dto) {
        return dto;
    }
}