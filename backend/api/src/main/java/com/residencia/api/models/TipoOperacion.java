package com.residencia.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tipos_operacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoOperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(name = "es_egreso")
    private boolean esEgreso;

    @Column(name = "impacta_en_caja")
    private boolean impactaEnCaja;
}