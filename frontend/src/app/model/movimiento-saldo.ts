import { Concepto } from "./concepto";
import { Entidad } from "./entidad";

export interface MovimientoSaldo {
    id?:number;
    esEntrada:boolean;
    esResidencia:boolean;
    monto:number;
    entidad?:Entidad;
    concepto?:Concepto;
    descripcion?:string;
    fechaHora:Date;
}
