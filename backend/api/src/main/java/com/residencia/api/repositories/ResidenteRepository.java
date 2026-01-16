package com.residencia.api.repositories;

import com.residencia.api.models.Residente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidenteRepository extends JpaRepository<Residente, Long>, JpaSpecificationExecutor<Residente> {
    List<Residente> findByEsActivoTrue();
    List<Residente> findByEsActivo(boolean esActivo);
    Optional<Residente> findByDniCuit(String dniCuit);
}