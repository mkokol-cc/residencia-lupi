package com.residencia.api.specifications;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchCriteria {
    private String key;      // Campo (ej: "nombre", "entidad.dniCuit")
    private String operation; // Operación (":", ">", "<")
    private Object value;     // Valor a buscar
}