import { Pago } from "../../model/pago";

export const PAGO_DATA: Pago[] = [
    { 
      id: 1, 
      esEntrada: true, 
      esResidencia: true, 
      monto: 15000, 
      fechaHora: new Date('2024-05-10'),
      entidad: { dniCuit: '1', nombre: 'Banco Galicia' },
      metodo: { id: 1, nombre: 'Transferencia' }
    },
    { 
      id: 2, 
      esEntrada: false, 
      esResidencia: true,
      monto: 3500, 
      fechaHora: new Date('2024-05-12'),
      entidad: { dniCuit: '3', nombre: 'Efectivo' },
      metodo: { id: 3, nombre: 'Efectivo' }
    }
];