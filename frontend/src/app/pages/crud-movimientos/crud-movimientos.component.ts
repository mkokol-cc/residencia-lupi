import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

// Componentes y Modelos
import { MovimientoSaldo } from '../../model/movimiento-saldo';
import { DialogMovimientoComponent } from '../../dialogs/dialog-movimiento/dialog-movimiento.component';
import { MovimientoSaldoService } from '../../custom-services/movimiento-saldo.service';
import { Entidad } from '../../model/entidad';
import { Concepto } from '../../model/concepto';
import { ResidenteService } from '../../custom-services/residente.service';
import { ProveedorService } from '../../custom-services/proveedor.service';
import { ConceptoService } from '../../custom-services/concepto.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';
import { PagoService } from '../../custom-services/pago.service';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { Pago } from '../../model/pago';
import { MetodoPago } from '../../model/metodo-pago';

@Component({
  selector: 'app-crud-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    NoDataTemplateComponent,
    MatAutocompleteModule,
    MatRadioModule
  ],
  templateUrl: './crud-movimientos.component.html'
})
export class CrudMovimientosComponent implements OnInit {
  filterForm!: FormGroup;

  movimientos: MovimientoSaldo[] = [];
  entidades: Entidad[] = [];
  conceptos: Concepto[] = [];
  metodosPago: MetodoPago[] = [];
  
  filteredEntidades!: Observable<Entidad[]>;
  filteredConceptos!: Observable<Concepto[]>;
  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild('confirmPagoDialog') confirmPagoDialog!: TemplateRef<any>;
  movimientoParaPagar?: MovimientoSaldo;
  selectedMetodoPagoId: number | null = null;
  selectedEsResidencia: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private movimientoService: MovimientoSaldoService,
    private residenteService: ResidenteService,
    private proveedorService: ProveedorService,
    private conceptoService: ConceptoService,
    private pagoService: PagoService,
    private metodoPagoService: MetodoPagoService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      entidadId: [null],
      conceptoId: [null],
      fechaInicio: [null],
      fechaFin: [null],
      montoMin: [null],
      montoMax: [null],
      orden: ['fechaHora,desc']
    });

    this.filteredEntidades = this.filterForm.get('entidadId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterEntidades(name as string) : this.entidades.slice();
      })
    );

    this.filteredConceptos = this.filterForm.get('conceptoId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterConceptos(name as string) : this.conceptos.slice();
      })
    );

    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    forkJoin({
      movimientosPage: this.movimientoService.searchMovimientos(this.filterForm.value, this.pageIndex, this.pageSize),
      residentes: this.residenteService.getResidentes(),
      proveedores: this.proveedorService.getProveedores(),
      conceptos: this.conceptoService.getConceptos(),
      metodosPago: this.metodoPagoService.getMetodosPago()
    }).subscribe(({ movimientosPage, residentes, proveedores, conceptos, metodosPago }) => {
      this.procesarRespuesta(movimientosPage);
      this.entidades = [...residentes, ...proveedores];
      this.conceptos = conceptos;
      this.metodosPago = metodosPago;
      // Actualizar filtros para que tomen los nuevos datos
      this.filterForm.get('entidadId')?.updateValueAndValidity({ emitEvent: true });
      this.filterForm.get('conceptoId')?.updateValueAndValidity({ emitEvent: true });
    });
  }

  procesarRespuesta(data: any): void {
    this.movimientos = data.content;
    this.totalElements = data.totalElements;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ejecutarBusqueda();
  }

  applyFilters(): void {
    // Reiniciar a primera página al filtrar
    this.pageIndex = 0;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda(): void {
    const filters = { ...this.filterForm.value };
    
    // Si es objeto (seleccionado del autocomplete), extraemos el ID
    if (filters.entidadId && typeof filters.entidadId === 'object') {
      filters.entidadId = filters.entidadId.id;
    } else if (typeof filters.entidadId === 'string') {
      filters.entidadId = null; // Si escribió texto pero no seleccionó, enviamos null
    }

    if (filters.conceptoId && typeof filters.conceptoId === 'object') {
      filters.conceptoId = filters.conceptoId.id;
    } else if (typeof filters.conceptoId === 'string') {
      filters.conceptoId = null;
    }

    this.movimientoService.searchMovimientos(filters, this.pageIndex, this.pageSize)
      .subscribe(data => this.procesarRespuesta(data));
  }

  abrirDialogo(movimiento?: MovimientoSaldo): void {
    this.dialog.open(DialogMovimientoComponent, {
      width: '450px',
      data: { movimiento, entidades: this.entidades, conceptos: this.conceptos }
    }).afterClosed().subscribe(result => {
      if (result) this.guardarMovimiento(result);
    });
  }

  private guardarMovimiento(movimiento: MovimientoSaldo): void {
    this.movimientoService.guardarMovimiento(movimiento).subscribe((res: any) => {
      this.snackBar.open('Movimiento guardado con éxito', 'Cerrar', { duration: 3000 });
      this.ejecutarBusqueda();

      // Preparar y abrir modal de pago automático
      this.movimientoParaPagar = res || movimiento;
      if (this.metodosPago.length > 0) {
        this.selectedMetodoPagoId = this.metodosPago[0].id;
      }
      this.selectedEsResidencia = this.movimientoParaPagar?.esResidencia ?? true;
      this.dialog.open(this.confirmPagoDialog, { width: '400px' });
    });
  }

  eliminarMovimiento(id: string | number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      this.movimientoService.eliminarMovimiento(id).subscribe(() => {
        this.snackBar.open('Movimiento eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.ejecutarBusqueda();
      });
    }
  }

  displayEntidad(entidad: Entidad): string {
    return entidad && entidad.nombre ? entidad.nombre : '';
  }

  private _filterEntidades(name: string): Entidad[] {
    const filterValue = name.toLowerCase();
    return this.entidades.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayConcepto(concepto: Concepto): string {
    return concepto && concepto.nombre ? concepto.nombre : '';
  }

  private _filterConceptos(name: string): Concepto[] {
    const filterValue = name.toLowerCase();
    return this.conceptos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  confirmarPago(): void {
    if (!this.movimientoParaPagar || !this.selectedMetodoPagoId || this.selectedEsResidencia === null) return;

    const metodo = this.metodosPago.find(m => m.id === this.selectedMetodoPagoId);
    if (!metodo) return;

    const pago: Pago = {
      monto: this.movimientoParaPagar.monto,
      fechaHora: new Date(), // El pago se registra con fecha actual
      esEntrada: !this.movimientoParaPagar.esEntrada,
      entidad: this.movimientoParaPagar.entidad,
      metodo: metodo,
      esResidencia: this.selectedEsResidencia
      //descripcion: `Pago automático por movimiento: ${this.movimientoParaPagar.descripcion || ''}`
    };

    this.pagoService.guardarPago(pago).subscribe(() => {
      this.snackBar.open('Pago registrado con éxito', 'Cerrar', { duration: 3000 });
      this.dialog.closeAll();
    });
  }
}
