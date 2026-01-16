package com.residencia.api.dtos;

import com.residencia.api.models.Proveedor;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

public class ProveedorDTO {
    @JsonUnwrapped
    private Proveedor proveedor;
    private Double saldo;

    public ProveedorDTO(Proveedor proveedor, Double saldo) {
        this.proveedor = proveedor;
        this.saldo = saldo;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }
}