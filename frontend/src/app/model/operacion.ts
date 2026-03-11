import { Concepto } from "./concepto";
import { Entidad } from "./entidad";
import { MetodoPago } from "./metodo-pago";
import { TipoOperacion } from "./tipo-operacion";

export interface Operacion {
    id?:number;
    tipoOperacion?:TipoOperacion;
    entidad?:Entidad;
    esResidencia?:boolean;
    monto:number;
    metodo?:MetodoPago;
    fechaHora:Date;
    concepto?:Concepto;
    descripcion?:string;
}
