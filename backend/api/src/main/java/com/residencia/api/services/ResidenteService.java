package com.residencia.api.services;

import com.residencia.api.dtos.ResidenteDTO;
import com.residencia.api.models.Residente;
import com.residencia.api.repositories.ResidenteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResidenteService extends GenericService<Residente, Residente, Long> {

    @Autowired
    private ResidenteRepository residenteRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected JpaRepository<Residente, Long> getRepository() {
        return residenteRepository;
    }

    @Override
    protected Residente toDTO(Residente entity) {
        return entity;
    }

    @Override
    protected Residente toEntity(Residente dto) {
        return dto;
    }

    public Page<Residente> search(Specification<Residente> spec, Pageable pageable) {
        return residenteRepository.findAll(spec, pageable);
    }

    public Page<ResidenteDTO> searchResidentes(String search, Pageable pageable) {
        StringBuilder jpql = new StringBuilder(
            "SELECT r, " +
            "(COALESCE((SELECT SUM(m.monto) FROM MovimientoSaldo m WHERE m.entidad.id = r.id), 0) - " +
            " COALESCE((SELECT SUM(p.monto) FROM Pago p WHERE p.entidad.id = r.id), 0)) as saldo " +
            "FROM Residente r WHERE 1=1 "
        );

        if (search != null && !search.isEmpty()) {
            jpql.append("AND (LOWER(r.nombre) LIKE LOWER(:search) OR LOWER(r.apellido) LIKE LOWER(:search) OR r.dniCuit LIKE :search) ");
        }

        if (pageable.getSort().isSorted()) {
            jpql.append("ORDER BY ");
            pageable.getSort().forEach(order -> {
                if (order.getProperty().equals("saldo")) {
                    jpql.append("saldo ").append(order.getDirection());
                } else {
                    jpql.append("r.").append(order.getProperty()).append(" ").append(order.getDirection());
                }
                jpql.append(", ");
            });
            jpql.setLength(jpql.length() - 2);
        }

        TypedQuery<Object[]> query = entityManager.createQuery(jpql.toString(), Object[].class);
        if (search != null && !search.isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Object[]> results = query.getResultList();
        List<ResidenteDTO> dtos = results.stream()
            .map(row -> new ResidenteDTO((Residente) row[0], (Double) row[1]))
            .collect(Collectors.toList());

        // Count query
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(r) FROM Residente r WHERE 1=1 ");
        if (search != null && !search.isEmpty()) {
            countJpql.append("AND (LOWER(r.nombre) LIKE LOWER(:search) OR LOWER(r.apellido) LIKE LOWER(:search) OR r.dniCuit LIKE :search) ");
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql.toString(), Long.class);
        if (search != null && !search.isEmpty()) {
            countQuery.setParameter("search", "%" + search + "%");
        }
        Long total = countQuery.getSingleResult();

        return new PageImpl<>(dtos, pageable, total);
    }
}