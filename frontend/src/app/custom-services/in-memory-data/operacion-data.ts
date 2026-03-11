import { Operacion } from "../../model/operacion";

export const OPERACION_DATA: Operacion[] = [
    {
        id: 1,
        tipoOperacion: { id: 1, nombre: 'Venta de Mercadería', esEgreso: false, impactaEnCaja: true },
        entidad: { id: 1, nombre: 'Juan Perez', dniCuit: '20-30123456-7' },
        esResidencia: true,
        monto: 15000,
        metodo: { id: 1, nombre: 'Efectivo' },
        fechaHora: new Date('2024-05-20T10:00:00'),
        concepto: { id: 1, nombre: 'Cuota Mensual', esDeIngreso: true },
        descripcion: 'Pago de cuota de mayo'
    },
    {
        id: 2,
        tipoOperacion: { id: 2, nombre: 'Compra de Insumos', esEgreso: true, impactaEnCaja: true },
        entidad: { id: 101, nombre: 'Limpieza Total S.A.', dniCuit: '30-70123456-8' },
        esResidencia: true,
        monto: 8500,
        metodo: { id: 2, nombre: 'Transferencia Bancaria' },
        fechaHora: new Date('2024-05-19T15:30:00'),
        concepto: { id: 3, nombre: 'Insumos de Limpieza', esDeIngreso: false },
        descripcion: 'Compra de lavandina y detergente'
    },
    {
        id: 3,
        tipoOperacion: { id: 3, nombre: 'Pago de Sueldos', esEgreso: true, impactaEnCaja: true },
        esResidencia: true,
        monto: 120000,
        metodo: { id: 2, nombre: 'Transferencia Bancaria' },
        fechaHora: new Date('2024-05-05T09:00:00'),
        concepto: { id: 4, nombre: 'Sueldos y Jornales', esDeIngreso: false },
        descripcion: 'Sueldo de personal de abril'
    }
];