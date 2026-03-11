package com.residencia.api.repositories;

import com.residencia.api.models.TipoOperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoOperacionRepository extends JpaRepository<TipoOperacion, Long>, JpaSpecificationExecutor<TipoOperacion> {
}