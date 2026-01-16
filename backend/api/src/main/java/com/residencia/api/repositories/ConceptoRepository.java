package com.residencia.api.repositories;

import com.residencia.api.models.Concepto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptoRepository extends JpaRepository<Concepto, Long>, JpaSpecificationExecutor<Concepto> {
    List<Concepto> findByEsDeIngreso(boolean esDeIngreso);
    List<Concepto> findByPadreIsNull(); // Para obtener las categorías raíz
}