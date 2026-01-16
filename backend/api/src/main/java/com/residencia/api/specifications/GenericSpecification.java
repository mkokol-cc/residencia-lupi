package com.residencia.api.specifications;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@AllArgsConstructor
public class GenericSpecification<T> implements Specification<T> {

    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        // Manejo de propiedades anidadas (ej: "entidad.nombre")
        Path<?> path = root;
        if (criteria.getKey().contains(".")) {
            String[] split = criteria.getKey().split("\\.");
            for (String part : split) {
                path = path.get(part);
            }
        } else {
            path = root.get(criteria.getKey());
        }

        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(path.as(String.class), criteria.getValue().toString());
        } 
        else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(path.as(String.class), criteria.getValue().toString());
        } 
        else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (path.getJavaType() == String.class) {
                return builder.like(
                    builder.lower(path.as(String.class)), 
                    "%" + criteria.getValue().toString().toLowerCase() + "%"
                );
            } else {
                return builder.equal(path, criteria.getValue());
            }
        }
        return null;
    }
}