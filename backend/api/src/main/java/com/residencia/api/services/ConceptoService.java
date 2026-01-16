package com.residencia.api.services;

import com.residencia.api.models.Concepto;
import com.residencia.api.repositories.ConceptoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Service
public class ConceptoService extends GenericService<Concepto, Concepto, Long> {

    @Autowired
    private ConceptoRepository conceptoRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected JpaRepository<Concepto, Long> getRepository() {
        return conceptoRepository;
    }

    @Override
    protected Concepto toDTO(Concepto entity) {
        return entity;
    }

    @Override
    protected Concepto toEntity(Concepto dto) {
        return dto;
    }

    public Page<Concepto> searchConceptos(String search, Pageable pageable) {
        StringBuilder jpql = new StringBuilder("SELECT c FROM Concepto c WHERE c.esDeIngreso = false ");

        if (search != null && !search.isEmpty()) {
            jpql.append("AND LOWER(c.nombre) LIKE LOWER(:search) ");
        }

        if (pageable.getSort().isSorted()) {
            jpql.append("ORDER BY ");
            pageable.getSort().forEach(order -> {
                jpql.append("c.").append(order.getProperty()).append(" ").append(order.getDirection()).append(", ");
            });
            jpql.setLength(jpql.length() - 2);
        }

        TypedQuery<Concepto> query = entityManager.createQuery(jpql.toString(), Concepto.class);
        if (search != null && !search.isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Concepto> result = query.getResultList();

        // Para el total de elementos (necesario para el paginador)
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(c) FROM Concepto c WHERE c.esDeIngreso = false ");
        if (search != null && !search.isEmpty()) {
            countJpql.append("AND LOWER(c.nombre) LIKE LOWER(:search) ");
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql.toString(), Long.class);
        if (search != null && !search.isEmpty()) {
            countQuery.setParameter("search", "%" + search + "%");
        }
        Long total = countQuery.getSingleResult();

        return new PageImpl<>(result, pageable, total);
    }
}