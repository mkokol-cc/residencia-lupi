import { Entidad } from "./entidad";

export interface Proveedor extends Entidad {
    id:number;
    dniCuit:string;
    nombre:string;
    direccion?:string;
    telefono?:string;
    saldo?: number;
}
