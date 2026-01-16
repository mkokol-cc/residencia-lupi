package com.residencia.api.repositories;

import com.residencia.api.models.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long>, JpaSpecificationExecutor<Pago> {
    List<Pago> findByEntidadId(Long entidadId);
    List<Pago> findByEntidadIdOrderByFechaHoraDesc(Long entidadId);
}