import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { CONCEPTO_DATA } from './in-memory-data/concepto-data';
import { RESIDENTE_DATA } from './in-memory-data/residente-data';
import { PROVEEDOR_DATA } from './in-memory-data/proveedor-data';
import { METODO_PAGO_DATA } from './in-memory-data/metodo-pago-data';
import { PAGO_DATA } from './in-memory-data/pago-data';
import { MOVIMIENTO_SALDO_DATA } from './in-memory-data/movimiento-saldo-data';
import { TIPO_OPERACION_DATA } from './in-memory-data/tipo-operacion-data';
import { OPERACION_DATA } from './in-memory-data/operacion-data';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return {
      conceptos: CONCEPTO_DATA, 
      residentes: RESIDENTE_DATA, 
      proveedores: PROVEEDOR_DATA, 
      metodosPago: METODO_PAGO_DATA, 
      pagos: PAGO_DATA,
      movimientosSaldo: MOVIMIENTO_SALDO_DATA,
      tiposOperacion: TIPO_OPERACION_DATA,
      operaciones: OPERACION_DATA
    };
  }

  /**
   * Sobrescribe el método genId para manejar IDs numéricos y de tipo string.
   */
  genId<T extends { id: any }>(collection: T[]): any {
    if (collection && collection.length > 0) {
      // Si los IDs son strings numéricos, genera un nuevo string numérico
      if (typeof collection[0].id === 'string') {
        const maxId = Math.max(...collection.map(item => parseInt(item.id || '0', 10))) + 1;
        return maxId.toString();
      }
    }
    // De lo contrario, usa la lógica para IDs numéricos
    return collection.length > 0 ? Math.max(...collection.map(item => item.id || 0)) + 1 : 1;
  }
}
