import { Injectable } from '@angular/core';
import { Operacion } from '../../model/operacion';
import { ReporteData } from './reporte-data';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public procesarOperaciones(operaciones: Operacion[], filtros: any): { reporteData: ReporteData, reporteDataView: any[], saldo: number } {
    
    const operacionesFiltradas = operaciones.filter(op => {
      const fecha = new Date(op.fechaHora);
      const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
      const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;
      if (fechaDesde) fechaDesde.setHours(0, 0, 0, 0);
      if (fechaHasta) fechaHasta.setHours(23, 59, 59, 999);

      const fechaOk = (!fechaDesde || fecha >= fechaDesde) && (!fechaHasta || fecha <= fechaHasta);
      const conceptoOk = !filtros.conceptoId || op.concepto?.id === filtros.conceptoId;
      const entidadOk = !filtros.entidadId || op.entidad?.id === filtros.entidadId;
      const metodoPagoOk = !filtros.metodoPagoId || op.metodo?.id === filtros.metodoPagoId;
      const tipoOperacionOk = !filtros.tipoOperacionId || op.tipoOperacion?.id === filtros.tipoOperacionId;

      return fechaOk && conceptoOk && entidadOk && metodoPagoOk && tipoOperacionOk;
    });

    const reporteDataView = operacionesFiltradas.map(op => ({
      ...op,
      // El monto es siempre positivo, 'esEgreso' define el signo.
      signedMonto: op.tipoOperacion?.esEgreso ? -op.monto : op.monto
    })).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

    // Calculamos los totales por categoría
    let ventas = 0;
    let compras = 0;
    let cobros = 0;
    let pagos = 0;

    operacionesFiltradas.forEach(op => {
      const tipo = op.tipoOperacion;
      if (!tipo) return;

      if (tipo.esEgreso) {
        // Es un egreso
        if (tipo.impactaEnCaja) {
          pagos += op.monto; // Egreso + Caja = PAGO
        } else {
          ventas += op.monto; // Egreso + No Caja = VENTA
        }
      } else {
        // Es un ingreso
        if (tipo.impactaEnCaja) {
          cobros += op.monto; // Ingreso + Caja = COBRO
        } else {
          compras += op.monto; // Ingreso + No Caja = COMPRAS
        }
      }
    });

    // Saldo = Total Ingresos - Total Egresos
    const saldo = (ventas + cobros) - (compras + pagos);

    // Retornamos un arreglo para que sea compatible con la tabla y el PDF
    const reporteData:ReporteData = {
      ventas: ventas,
      compras: compras,
      cobros: cobros,
      pagos: pagos,
    };

    return { reporteData, reporteDataView, saldo };
  }
}
