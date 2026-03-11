import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Models
import { Pago } from '../../model/pago';
import { MetodoPago } from '../../model/metodo-pago';

// Services
import { PagoService } from '../../custom-services/pago.service';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';

interface CajaRow {
  metodo: string;
  ingreso: number;
  egreso: number;
  total: number;
}

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})
export class CajaComponent implements OnInit {
  dataSource: CajaRow[] = [];
  displayedColumns: string[] = ['metodo', 'ingreso', 'egreso', 'total'];
  totalIngresos = 0;
  totalEgresos = 0;
  totalGeneral = 0;
  isLoading = true;

  constructor(
    private pagoService: PagoService,
    private metodoPagoService: MetodoPagoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      pagos: this.pagoService.getPagos(),
      metodos: this.metodoPagoService.getMetodosPago()
    }).subscribe(({ pagos, metodos }) => {
      this.calcularResumen(pagos, metodos);
      this.isLoading = false;
    });
  }

  private calcularResumen(pagos: Pago[], metodos: MetodoPago[]): void {
    const resumenMap = new Map<string, CajaRow>();

    // Inicializar con métodos conocidos
    metodos.forEach(metodo => {
      resumenMap.set(metodo.nombre, { metodo: metodo.nombre, ingreso: 0, egreso: 0, total: 0 });
    });

    pagos.forEach(pago => {
      const metodoNombre = pago.metodo?.nombre || 'No especificado';
      if (!resumenMap.has(metodoNombre)) {
        resumenMap.set(metodoNombre, { metodo: metodoNombre, ingreso: 0, egreso: 0, total: 0 });
      }
      
      const row = resumenMap.get(metodoNombre)!;

      if (pago.esEntrada) {
        row.ingreso += pago.monto;
      } else {
        row.egreso += pago.monto;
      }
      row.total = row.ingreso - row.egreso;
    });

    this.dataSource = Array.from(resumenMap.values());

    this.totalIngresos = this.dataSource.reduce((acc, curr) => acc + curr.ingreso, 0);
    this.totalEgresos = this.dataSource.reduce((acc, curr) => acc + curr.egreso, 0);
    this.totalGeneral = this.totalIngresos - this.totalEgresos;
  }
}
