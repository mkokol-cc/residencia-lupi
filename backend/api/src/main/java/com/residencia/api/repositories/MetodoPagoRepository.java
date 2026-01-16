package com.residencia.api.repositories;

import com.residencia.api.models.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long>, JpaSpecificationExecutor<MetodoPago> {
}