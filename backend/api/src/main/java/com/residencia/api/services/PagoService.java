package com.residencia.api.services;

import com.residencia.api.models.Pago;
import com.residencia.api.repositories.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class PagoService extends GenericService<Pago, Pago, Long> {

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    protected JpaRepository<Pago, Long> getRepository() {
        return pagoRepository;
    }

    @Override
    protected Pago toDTO(Pago entity) {
        return entity; // Aquí iría el mapeo a DTO si existiera
    }

    @Override
    protected Pago toEntity(Pago dto) {
        return dto;
    }

    // Método smart para filtrar y paginar
    public Page<Pago> search(Specification<Pago> spec, Pageable pageable) {
        return pagoRepository.findAll(spec, pageable);
    }
}