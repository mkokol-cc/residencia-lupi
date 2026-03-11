import { Entidad } from "./entidad";
import { MetodoPago } from "./metodo-pago";

export interface Pago {
    id?:number;
    entidad?:Entidad;
    esEntrada:boolean;
    esResidencia?:boolean;
    monto:number;
    metodo:MetodoPago;
    fechaHora:Date;
}
