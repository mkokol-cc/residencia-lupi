import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
// Componentes y Modelos
import { Pago } from '../../model/pago';
import { DialogPagoComponent } from '../../dialogs/dialog-pago/dialog-pago.component';
import { PagoService } from '../../custom-services/pago.service';
import { Entidad } from '../../model/entidad';
import { MetodoPago } from '../../model/metodo-pago';
import { ResidenteService } from '../../custom-services/residente.service';
import { ProveedorService } from '../../custom-services/proveedor.service';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';

@Component({
  selector: 'app-crud-pagos',
  standalone: true,
  imports: [
    CommonModule,
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
    MatAutocompleteModule
  ],
  templateUrl: './crud-pagos.component.html'
})
export class CrudPagosComponent implements OnInit {
  filterForm!: FormGroup;

  pagos: Pago[] = [];
  entidades: Entidad[] = [];
  metodosDePago: MetodoPago[] = [];
  filteredEntidades!: Observable<Entidad[]>;
  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private pagoService: PagoService,
    private residenteService: ResidenteService,
    private proveedorService: ProveedorService,
    private metodoPagoService: MetodoPagoService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      entidadId: [null],
      metodoId: [null],
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

    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    forkJoin({
      pagosPage: this.pagoService.searchPagos(this.filterForm.value, this.pageIndex, this.pageSize),
      residentes: this.residenteService.getResidentes(),
      proveedores: this.proveedorService.getProveedores(),
      metodosDePago: this.metodoPagoService.getMetodosPago()
    }).subscribe(({ pagosPage, residentes, proveedores, metodosDePago }) => {
      this.procesarRespuesta(pagosPage);
      // Combinamos residentes y proveedores en una sola lista de entidades
      this.entidades = [...residentes, ...proveedores];
      this.metodosDePago = metodosDePago;
      this.filterForm.get('entidadId')?.updateValueAndValidity({ emitEvent: true });
    });
  }

  procesarRespuesta(data: any): void {
    this.pagos = data.content;
    this.totalElements = data.totalElements;
  }

  cargarPagos(): void {
    this.ejecutarBusqueda();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda(): void {
    const filters = { ...this.filterForm.value };

    if (filters.entidadId && typeof filters.entidadId === 'object') {
      filters.entidadId = filters.entidadId.id;
    } else if (typeof filters.entidadId === 'string') {
      filters.entidadId = null;
    }

    this.pagoService.searchPagos(filters, this.pageIndex, this.pageSize)
      .subscribe(data => this.procesarRespuesta(data));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ejecutarBusqueda();
  }

  abrirDialogo(pago?: Pago): void {
    const dialogRef = this.dialog.open(DialogPagoComponent, {
      width: '450px',
      data: {
        pago: pago,
        entidades: this.entidades,
        metodosDePago: this.metodosDePago
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarPago(result);
      }
    });
  }

  private guardarPago(pago: Pago): void {
    this.pagoService.guardarPago(pago).subscribe({
      next: () => {
        this.snackBar.open('Pago guardado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarPagos();
      },
      error: (err) => this.snackBar.open('Error al guardar el pago', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarPago(id: string | number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      this.pagoService.eliminarPago(id).subscribe(() => {
        this.snackBar.open('Pago eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarPagos();
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
}