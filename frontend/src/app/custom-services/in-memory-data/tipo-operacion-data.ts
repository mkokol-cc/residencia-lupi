import { TipoOperacion } from "../../model/tipo-operacion";

export const TIPO_OPERACION_DATA: TipoOperacion[] = [
    { id: 1, nombre: 'Venta de Mercadería', esEgreso: false, impactaEnCaja: true },
    { id: 2, nombre: 'Compra de Insumos', esEgreso: true, impactaEnCaja: true },
    { id: 3, nombre: 'Pago de Sueldos', esEgreso: true, impactaEnCaja: true },
    { id: 4, nombre: 'Retiro Personal', esEgreso: true, impactaEnCaja: false },
    { id: 5, nombre: 'Aporte de Capital', esEgreso: false, impactaEnCaja: false },
    { id: 6, nombre: 'Pago de Servicios', esEgreso: true, impactaEnCaja: true }
];