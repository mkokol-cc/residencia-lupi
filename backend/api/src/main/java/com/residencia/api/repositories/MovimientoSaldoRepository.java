package com.residencia.api.repositories;

import com.residencia.api.models.MovimientoSaldo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoSaldoRepository extends JpaRepository<MovimientoSaldo, Long>, JpaSpecificationExecutor<MovimientoSaldo> {
    List<MovimientoSaldo> findByEntidadId(Long entidadId);
    List<MovimientoSaldo> findByEntidadIdOrderByFechaHoraDesc(Long entidadId);
}