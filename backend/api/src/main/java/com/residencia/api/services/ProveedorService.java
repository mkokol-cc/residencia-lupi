package com.residencia.api.services;

import com.residencia.api.dtos.ProveedorDTO;
import com.residencia.api.models.Proveedor;
import com.residencia.api.repositories.ProveedorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProveedorService extends GenericService<Proveedor, Proveedor, Long> {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected JpaRepository<Proveedor, Long> getRepository() {
        return proveedorRepository;
    }

    @Override
    protected Proveedor toDTO(Proveedor entity) {
        return entity;
    }

    @Override
    protected Proveedor toEntity(Proveedor dto) {
        return dto;
    }

    public Page<ProveedorDTO> searchProveedores(String search, Pageable pageable) {
        StringBuilder jpql = new StringBuilder(
            "SELECT p, " +
            "(COALESCE((SELECT SUM(m.monto) FROM MovimientoSaldo m WHERE m.entidad.id = p.id), 0) - " +
            " COALESCE((SELECT SUM(pg.monto) FROM Pago pg WHERE pg.entidad.id = p.id), 0)) as saldo " +
            "FROM Proveedor p WHERE 1=1 "
        );

        if (search != null && !search.isEmpty()) {
            jpql.append("AND (LOWER(p.nombre) LIKE LOWER(:search) OR p.dniCuit LIKE :search) ");
        }

        if (pageable.getSort().isSorted()) {
            jpql.append("ORDER BY ");
            pageable.getSort().forEach(order -> {
                if (order.getProperty().equals("saldo")) {
                    jpql.append("saldo ").append(order.getDirection());
                } else {
                    jpql.append("p.").append(order.getProperty()).append(" ").append(order.getDirection());
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
        List<ProveedorDTO> dtos = results.stream()
            .map(row -> new ProveedorDTO((Proveedor) row[0], (Double) row[1]))
            .collect(Collectors.toList());

        // Count query
        StringBuilder countJpql = new StringBuilder("SELECT COUNT(p) FROM Proveedor p WHERE 1=1 ");
        if (search != null && !search.isEmpty()) {
            countJpql.append("AND (LOWER(p.nombre) LIKE LOWER(:search) OR p.dniCuit LIKE :search) ");
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql.toString(), Long.class);
        if (search != null && !search.isEmpty()) {
            countQuery.setParameter("search", "%" + search + "%");
        }
        Long total = countQuery.getSingleResult();

        return new PageImpl<>(dtos, pageable, total);
    }
}