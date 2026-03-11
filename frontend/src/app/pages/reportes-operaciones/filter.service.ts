import { Injectable } from '@angular/core';
import { Operacion } from '../../model/operacion';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public procesarOperaciones(operaciones: Operacion[], filtros: any): { reporteData: any[], reporteDataView: any[], saldo: number } {
    
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

    const { ingresos, egresos } = this.calcularTotales(reporteDataView);
    const saldo = ingresos - egresos;

    const reporteData = [
      { descripcion: 'Total Ingresos', valor: ingresos },
      { descripcion: 'Total Egresos', valor: egresos },
      { descripcion: 'SALDO', valor: saldo, esTotal: true },
    ];

    return { reporteData, reporteDataView, saldo };
  }

  private calcularTotales(operaciones: any[]): { ingresos: number, egresos: number } {
    let ingresos = 0;
    let egresos = 0;

    operaciones.forEach(op => {
      if (op.signedMonto > 0) {
        ingresos += op.monto;
      } else {
        egresos += op.monto;
      }
    });

    return { ingresos, egresos };
  }
}
