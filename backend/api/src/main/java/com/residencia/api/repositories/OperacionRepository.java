package com.residencia.api.repositories;

import com.residencia.api.models.Operacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OperacionRepository extends JpaRepository<Operacion, Long>, JpaSpecificationExecutor<Operacion> {
}