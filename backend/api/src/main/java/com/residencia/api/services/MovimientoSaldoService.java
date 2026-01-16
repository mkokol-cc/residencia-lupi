package com.residencia.api.services;

import com.residencia.api.models.MovimientoSaldo;
import com.residencia.api.repositories.MovimientoSaldoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class MovimientoSaldoService extends GenericService<MovimientoSaldo, MovimientoSaldo, Long> {

    @Autowired
    private MovimientoSaldoRepository movimientoSaldoRepository;

    @Override
    protected JpaRepository<MovimientoSaldo, Long> getRepository() {
        return movimientoSaldoRepository;
    }

    @Override
    protected MovimientoSaldo toDTO(MovimientoSaldo entity) {
        return entity;
    }

    @Override
    protected MovimientoSaldo toEntity(MovimientoSaldo dto) {
        return dto;
    }

    public Page<MovimientoSaldo> search(Specification<MovimientoSaldo> spec, Pageable pageable) {
        return movimientoSaldoRepository.findAll(spec, pageable);
    }
}