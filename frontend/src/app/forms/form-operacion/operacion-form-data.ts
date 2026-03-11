import { Concepto } from "../../model/concepto";
import { Entidad } from "../../model/entidad";
import { MetodoPago } from "../../model/metodo-pago";
import { TipoOperacion } from "../../model/tipo-operacion";

export interface OperacionFormData {
    id?:number;
    tipoOperacion?:TipoOperacion;
    entidad?:Entidad;
    esResidencia?:boolean;
    monto:number;
    metodo?:MetodoPago;
    fechaHora:Date;
    concepto?:Concepto;
    descripcion?:string;
    pagado?:boolean;    
}
