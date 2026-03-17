import { Component } from '@angular/core';
import { OperacionService } from '../../custom-services/operacion.service';
import { Operacion } from '../../model/operacion';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { forkJoin } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

interface CajaRow {
  metodo: string;
  ingreso: number;
  egreso: number;
  total: number;
}

@Component({
  selector: 'app-caja-operaciones',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './caja-operaciones.component.html',
  styles: ``
})
export class CajaOperacionesComponent {
  dataSource: CajaRow[] = [];
  displayedColumns: string[] = ['metodo', 'ingreso', 'egreso', 'total'];
  totalIngresos = 0;
  totalEgresos = 0;
  totalGeneral = 0;
  isLoading = true;

  constructor(
    private operacionService: OperacionService,
    private metodoPagoService: MetodoPagoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      operaciones: this.operacionService.getOperaciones(),
      metodos: this.metodoPagoService.getMetodosPago()
    }).subscribe(({ operaciones , metodos }) => {
      this.calcularResumen(operaciones.filter(o => o.tipoOperacion.impactaEnCaja), metodos);
      this.isLoading = false;
    });
  }

  private calcularResumen(operaciones: Operacion[], metodos): void {
    const resumenMap = new Map<string, CajaRow>();

    // Inicializar con métodos conocidos
    metodos.forEach(metodo => {
      resumenMap.set(metodo.nombre, { metodo: metodo.nombre, ingreso: 0, egreso: 0, total: 0 });
    });

    operaciones.forEach(o => {
      const metodoNombre = o.metodo?.nombre || null;
      if (!resumenMap.has(metodoNombre)) {
        resumenMap.set(metodoNombre, { metodo: metodoNombre, ingreso: 0, egreso: 0, total: 0 });
      }
      
      const row = resumenMap.get(metodoNombre)!;

      if (o.tipoOperacion.esEgreso) {
        row.egreso += o.monto;
      } else {
        row.ingreso += o.monto;
      }
      row.total = row.ingreso - row.egreso;
    });

    this.dataSource = Array.from(resumenMap.values());

    this.totalIngresos = this.dataSource.reduce((acc, curr) => acc + curr.ingreso, 0);
    this.totalEgresos = this.dataSource.reduce((acc, curr) => acc + curr.egreso, 0);
    this.totalGeneral = this.totalIngresos - this.totalEgresos;
  }
}
