package com.residencia.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "operaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tipo_operacion_id")
    private TipoOperacion tipoOperacion;

    @ManyToOne
    @JoinColumn(name = "entidad_id")
    private Entidad entidad;

    @Column(name = "es_residencia")
    private Boolean esResidencia;

    private Double monto;

    @ManyToOne
    @JoinColumn(name = "metodo_pago_id")
    private MetodoPago metodo;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "concepto_id")
    private Concepto concepto;

    private String descripcion;
}