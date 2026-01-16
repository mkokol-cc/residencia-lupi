package com.residencia.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "residentes")
@PrimaryKeyJoinColumn(name = "entidad_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Residente extends Entidad {

    @Column(name = "es_activo")
    private boolean esActivo;

    @Column(name = "nombre_pila")
    private String nombrePila;

    private String apellido;

    private String nota;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;
}
