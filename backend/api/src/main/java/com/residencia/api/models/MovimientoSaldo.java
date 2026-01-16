package com.residencia.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_saldo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoSaldo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "es_entrada")
    private boolean esEntrada;

    @Column(name = "es_residencia")
    private boolean esResidencia;

    private Double monto;

    @ManyToOne
    @JoinColumn(name = "entidad_id")
    private Entidad entidad;

    @ManyToOne
    @JoinColumn(name = "concepto_id")
    private Concepto concepto;

    private String descripcion;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
}
