import { Entidad } from "./entidad";

export interface Residente extends Entidad {
    id:number;
    esActivo:boolean;//ta vivo?
    nombre:string;
    nombrePila:string;
    apellido:string;
    nota?:string;
    fechaIngreso:string;
    dniCuit:string;
    saldo?: number;
}

/*
    obraSocial:ObraSocial;
    numeroObraSocial:string;
    nombre:string;
    apellido:string;
    fechaNacimiento:Date;
    fechaIngreso:Date;
    particular:boolean;
    emma:boolean;
    telefonoContacto1:string;
    parentezcoContacto1:string;
    nombreContaco1:string;
    apellidoContaco1:string;
    telefonoContacto2:string;
    parentezcoContacto2:string;
    nombreContaco2:string;
    apellidoContaco2:string;
    historiaClinica:Registro[];*/