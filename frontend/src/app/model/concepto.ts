export interface Concepto {
    id:number;
    nombre:string;
    padre?:Concepto
    esDeIngreso:boolean;
}
