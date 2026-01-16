package com.residencia.api.dtos;

import com.residencia.api.models.Residente;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

public class ResidenteDTO {
    @JsonUnwrapped
    private Residente residente;
    private Double saldo;

    public ResidenteDTO(Residente residente, Double saldo) {
        this.residente = residente;
        this.saldo = saldo;
    }

    public Residente getResidente() {
        return residente;
    }

    public void setResidente(Residente residente) {
        this.residente = residente;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }
}