package com.residencia.api.repositories;

import com.residencia.api.models.Entidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntidadRepository extends JpaRepository<Entidad, Long>, JpaSpecificationExecutor<Entidad> {
    // Buscar por DNI o CUIT (útil para validaciones)
    Optional<Entidad> findByDniCuit(String dniCuit);
}