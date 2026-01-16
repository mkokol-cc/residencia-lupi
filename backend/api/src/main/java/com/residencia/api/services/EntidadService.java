package com.residencia.api.services;

import com.residencia.api.models.Entidad;
import com.residencia.api.repositories.EntidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EntidadService extends GenericService<Entidad, Entidad, Long> {

    @Autowired
    private EntidadRepository entidadRepository;

    @Override
    protected JpaRepository<Entidad, Long> getRepository() {
        return entidadRepository;
    }

    @Override
    protected Entidad toDTO(Entidad entity) {
        return entity;
    }

    @Override
    protected Entidad toEntity(Entidad dto) {
        return dto;
    }
}