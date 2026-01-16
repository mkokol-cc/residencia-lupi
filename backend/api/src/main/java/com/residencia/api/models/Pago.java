package com.residencia.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "entidad_id")
    private Entidad entidad;

    @Column(name = "es_entrada")
    private boolean esEntrada;

    @Column(name = "es_residencia")
    private boolean esResidencia;
    
    private Double monto;

    @ManyToOne
    @JoinColumn(name = "metodo_pago_id")
    private MetodoPago metodo;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
}
