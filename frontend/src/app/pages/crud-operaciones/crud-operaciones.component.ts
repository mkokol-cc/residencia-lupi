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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

// Componentes y Modelos
import { Operacion } from '../../model/operacion';
import { DialogOperacionComponent } from '../../dialogs/dialog-operacion/dialog-operacion.component';
import { OperacionService } from '../../custom-services/operacion.service';
import { Entidad } from '../../model/entidad';
import { Concepto } from '../../model/concepto';
import { ResidenteService } from '../../custom-services/residente.service';
import { ProveedorService } from '../../custom-services/proveedor.service';
import { ConceptoService } from '../../custom-services/concepto.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { MetodoPago } from '../../model/metodo-pago';
import { TipoOperacion } from '../../model/tipo-operacion';
import { TipoOperacionService } from '../../custom-services/tipo-operacion.service';
import { OperacionFormData } from '../../forms/form-operacion/operacion-form-data';

@Component({
  selector: 'app-crud-operaciones',
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
    MatPaginatorModule,
    NoDataTemplateComponent,
    MatAutocompleteModule,
    MatRadioModule
  ],
  templateUrl: './crud-operaciones.component.html',
  styleUrl: './crud-operaciones.component.scss'
})
export class CrudOperacionesComponent implements OnInit {
  filterForm!: FormGroup;

  operaciones: Operacion[] = [];
  entidades: Entidad[] = [];
  conceptos: Concepto[] = [];
  metodosPago: MetodoPago[] = [];
  tiposOperacion: TipoOperacion[] = [];
  
  filteredEntidades!: Observable<Entidad[]>;
  filteredConceptos!: Observable<Concepto[]>;
  filteredTiposOperacion!: Observable<TipoOperacion[]>;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private operacionService: OperacionService,
    private residenteService: ResidenteService,
    private proveedorService: ProveedorService,
    private conceptoService: ConceptoService,
    private metodoPagoService: MetodoPagoService,
    private tipoOperacionService: TipoOperacionService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      entidad: [null],
      concepto: [null],
      tipoOperacion: [null],
      fechaInicio: [null],
      fechaFin: [null],
      montoMin: [null],
      montoMax: [null],
      orden: ['fechaHora,desc']
    });

    this.setupFilters();
    this.cargarDatosIniciales();
  }

  setupFilters(): void {
    this.filteredEntidades = this.filterForm.get('entidad')!.valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v, this.entidades) as Entidad[])
    );

    this.filteredConceptos = this.filterForm.get('concepto')!.valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v, this.conceptos) as Concepto[])
    );

    this.filteredTiposOperacion = this.filterForm.get('tipoOperacion')!.valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v, this.tiposOperacion) as TipoOperacion[])
    );
  }

  cargarDatosIniciales(): void {
    forkJoin({
      residentes: this.residenteService.getResidentes(),
      proveedores: this.proveedorService.getProveedores(),
      conceptos: this.conceptoService.getConceptos(),
      metodosPago: this.metodoPagoService.getMetodosPago(),
      tiposOperacion: this.tipoOperacionService.searchTiposOperacion('', 0, 100) // Asumo que existe y trae todo
    }).subscribe(({ residentes, proveedores, conceptos, metodosPago, tiposOperacion }) => {
      this.entidades = [...residentes, ...proveedores];
      this.conceptos = conceptos;
      this.metodosPago = metodosPago;
      this.tiposOperacion = tiposOperacion.content;
      this.filterForm.get('entidad')?.updateValueAndValidity({ emitEvent: true });
      this.filterForm.get('concepto')?.updateValueAndValidity({ emitEvent: true });
      this.filterForm.get('tipoOperacion')?.updateValueAndValidity({ emitEvent: true });
      this.ejecutarBusqueda();
    });
  }

  ejecutarBusqueda(): void {
    const filters = this.buildFilters();
    this.operacionService.searchOperaciones(filters, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.operaciones = data.content;
        this.totalElements = data.totalElements;
        console.log("data"+data)
        console.log(data)
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.ejecutarBusqueda();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ejecutarBusqueda();
  }

  abrirDialogo(operacion?: Operacion): void {
    this.dialog.open(DialogOperacionComponent, { width: '450px', data: { operacion, entidades: this.entidades, conceptos: this.conceptos, tiposOperacion: this.tiposOperacion, metodosPago: this.metodosPago }})
      .afterClosed().subscribe(
        result => result 
        && this.guardarOperacionData(result)
      );
  }

  private guardarOperacionData(operacionData: OperacionFormData): void {
    const operacion: Operacion = {
      tipoOperacion : operacionData.tipoOperacion,
      entidad : operacionData.entidad,
      esResidencia : operacionData.esResidencia,
      monto : operacionData.monto,
      metodo : operacionData.tipoOperacion.impactaEnCaja ? operacionData.metodo : null,
      fechaHora : operacionData.fechaHora,
      concepto : operacionData.concepto,
      descripcion : operacionData.descripcion,
    }
    this.guardarOperacion(operacion);
    if(!(operacionData.tipoOperacion.impactaEnCaja) && operacionData.pagado){
      let tipoOperacionDeCaja:TipoOperacion;
      if(operacionData.tipoOperacion.esEgreso){
        tipoOperacionDeCaja = this.tiposOperacion.find(tipo => tipo.nombre == 'PAGO')
      }else{
        tipoOperacionDeCaja = this.tiposOperacion.find(tipo => tipo.nombre == 'COBRO')
      }
      const operacionPago : Operacion = {
        tipoOperacion : tipoOperacionDeCaja,
        entidad : operacionData.entidad,
        esResidencia : operacionData.esResidencia,
        monto : operacionData.monto,
        metodo : operacionData.metodo,
        fechaHora : operacionData.fechaHora,
        concepto : operacionData.concepto,
        descripcion : operacionData.descripcion ? tipoOperacionDeCaja.nombre + ' ' + operacionData.descripcion : null,
      }
      this.guardarOperacion(operacionPago);
    }
  }

  private guardarOperacion(operacion: Operacion): void {
    this.operacionService.guardarOperacion(operacion).subscribe(() => {
      this.snackBar.open('Operación guardada', 'Cerrar', { duration: 3000 });
      this.ejecutarBusqueda();
    });
  }

  eliminarOperacion(id: number): void {
    if (confirm('¿Seguro que quieres eliminar esta operación?')) {
      this.operacionService.eliminarOperacion(id).subscribe(() => {
        this.snackBar.open('Operación eliminada', 'Cerrar', { duration: 3000 });
        this.ejecutarBusqueda();
      });
    }
  }

  private buildFilters = () => ({ ...this.filterForm.value, entidadId: this.filterForm.value.entidad?.id, conceptoId: this.filterForm.value.concepto?.id, tipoOperacionId: this.filterForm.value.tipoOperacion?.id });
  displayFn = (obj: { nombre: string }): string => obj?.nombre || '';
  private _filter = (value: string | {nombre: string} | null, list: any[]) => {
    const filterValue = (typeof value === 'string' ? value : value?.nombre || '').toLowerCase();
    return list.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
  
}