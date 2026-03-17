import { Component, OnInit } from '@angular/core';
import { Residente } from '../../model/residente';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';

// Modelos y Servicios
import { Concepto } from '../../model/concepto';
import { MovimientoSaldo } from '../../model/movimiento-saldo';
import { ResidenteService } from '../../custom-services/residente.service';
import { ConceptoService } from '../../custom-services/concepto.service';
import { OperacionService } from '../../custom-services/operacion.service';
import { Operacion } from '../../model/operacion';
import { TipoOperacionService } from '../../custom-services/tipo-operacion.service';
import { TipoOperacion } from '../../model/tipo-operacion';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-liquidacion-mensual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgxCurrencyDirective
  ],
  templateUrl: './liquidacion-mensual.component.html',
  styleUrl: './liquidacion-mensual.component.scss'
})
export class LiquidacionMensualComponent implements OnInit {

  liquidacionMensualForm: FormGroup;
  residentes: Residente[] = [];
  conceptoMensual?: Concepto;
  conceptoPanales?: Concepto;
  tipoOperacionVenta?: TipoOperacion;

  displayedColumns: string[] = ['nombre', 'mensual', 'panales'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private residenteService: ResidenteService,
    private conceptoService: ConceptoService,
    private operacionService: OperacionService,
    private tipoOperacionService: TipoOperacionService,
    private snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.liquidacionMensualForm = this.fb.group({
      mes: [currentMonth, [Validators.required, Validators.min(1), Validators.max(12)]],
      ano: [currentYear, [Validators.required, Validators.min(currentYear), Validators.max(currentYear)]],
      residentesLiquidacion: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  get residentesLiquidacion(): FormArray {
    return this.liquidacionMensualForm.get('residentesLiquidacion') as FormArray;
  }

  cargarDatosIniciales(): void {
    forkJoin({
      residentes: this.residenteService.getResidentes(),
      conceptos: this.conceptoService.getConceptos(),
      tipoOperaciones: this.tipoOperacionService.getTiposOperacion()
    }).subscribe(({ residentes, conceptos, tipoOperaciones }) => {
      this.residentes = residentes.filter(r => r.esActivo);
      
      // Asumo que los conceptos existen con estos nombres.
      // En una app real, sería mejor usar IDs fijos.
      this.conceptoMensual = conceptos.find(c => c.nombre === 'Cuota Mensual');
      this.conceptoPanales = conceptos.find(c => c.nombre === 'Pañales');

      // En una app real, sería mejor usar IDs fijos.
      this.tipoOperacionVenta = tipoOperaciones.find(to => to.nombre === 'VENTA');

      this.inicializarFormularioResidentes();
    });
  }

  inicializarFormularioResidentes(): void {
    this.residentesLiquidacion.clear();
    this.residentes.forEach(residente => {
      this.residentesLiquidacion.push(this.fb.group({
        residenteId: [residente.id],
        mensual: [0, [Validators.required, Validators.min(0)]],
        panales: [0, [Validators.required, Validators.min(0)]]
      }));
    });
    this.dataSource.data = this.residentesLiquidacion.controls;
  }

  guardarLiquidacion(): void {
    if (this.liquidacionMensualForm.invalid) {
      this.snackBar.open('Por favor, revise los datos del formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.conceptoMensual || !this.conceptoPanales) {
      this.snackBar.open('Error: No se encontraron los conceptos "Cuota Mensual" o "Pañales".', 'Cerrar', { duration: 5000 });
      return;
    }

    const formValue = this.liquidacionMensualForm.value;
    const mes = formValue.mes;
    const ano = formValue.ano;
    const fechaLiquidacion = new Date(ano, mes - 1, 1);

    const operacionesAGuardar: any[] = [];

    formValue.residentesLiquidacion.forEach((item: any) => {
      const residente = this.residentes.find(r => r.id === item.residenteId);
      if (!residente) return;

      // Generar movimiento para la cuota mensual
      if (item.mensual > 0) {
        const operacionMensual: Operacion = {
          tipoOperacion: this.tipoOperacionVenta,
          esResidencia: true, // Es un gasto/consumo del residente
          monto: item.mensual,
          entidad: residente,
          concepto: this.conceptoMensual,
          descripcion: `Liquidación cuota mensual ${mes}/${ano}`,
          fechaHora: fechaLiquidacion
        };
        operacionesAGuardar.push(this.operacionService.guardarOperacion(operacionMensual));
      }

      // Generar movimiento para los pañales
      if (item.panales > 0) {
        const operacionPanales: Operacion = {
          tipoOperacion: this.tipoOperacionVenta,
          esResidencia: true, // Es un gasto/consumo del residente
          monto: item.panales,
          entidad: residente,
          concepto: this.conceptoPanales,
          descripcion: `Liquidación pañales ${mes}/${ano}`,
          fechaHora: fechaLiquidacion
        };
        operacionesAGuardar.push(this.operacionService.guardarOperacion(operacionPanales));
      }
    });
      

    if (operacionesAGuardar.length === 0) {
      this.snackBar.open('No hay montos para liquidar.', 'Cerrar', { duration: 3000 });
      return;
    }

    console.log(operacionesAGuardar)

    forkJoin(operacionesAGuardar).subscribe({
      next: () => {
        this.snackBar.open(`Liquidación de ${operacionesAGuardar.length} items guardada con éxito.`, 'Cerrar', { duration: 3000 });
        this.inicializarFormularioResidentes(); // Resetea los valores a 0
      },
      error: (err) => {
        this.snackBar.open('Error al guardar la liquidación.', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }
    
}
