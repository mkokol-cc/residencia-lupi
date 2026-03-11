package com.residencia.api.services;

import com.residencia.api.models.Operacion;
import com.residencia.api.repositories.OperacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class OperacionService extends GenericService<Operacion, Operacion, Long> {

    @Autowired
    private OperacionRepository operacionRepository;

    @Override
    protected JpaRepository<Operacion, Long> getRepository() {
        return operacionRepository;
    }

    @Override
    protected Operacion toDTO(Operacion entity) {
        return entity;
    }

    @Override
    protected Operacion toEntity(Operacion dto) {
        return dto;
    }

    public Page<Operacion> search(Specification<Operacion> spec, Pageable pageable) {
        return operacionRepository.findAll(spec, pageable);
    }
}