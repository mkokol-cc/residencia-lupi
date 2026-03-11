package com.residencia.api.services;

import com.residencia.api.models.TipoOperacion;
import com.residencia.api.repositories.TipoOperacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class TipoOperacionService extends GenericService<TipoOperacion, TipoOperacion, Long> {

    @Autowired
    private TipoOperacionRepository tipoOperacionRepository;

    @Override
    protected JpaRepository<TipoOperacion, Long> getRepository() {
        return tipoOperacionRepository;
    }

    @Override
    protected TipoOperacion toDTO(TipoOperacion entity) {
        return entity;
    }

    @Override
    protected TipoOperacion toEntity(TipoOperacion dto) {
        return dto;
    }

    public Page<TipoOperacion> search(Specification<TipoOperacion> spec, Pageable pageable) {
        return tipoOperacionRepository.findAll(spec, pageable);
    }
}