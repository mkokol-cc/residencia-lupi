import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, take } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

// Models
import { Residente } from '../../model/residente';
import { Proveedor } from '../../model/proveedor';
import { MetodoPago } from '../../model/metodo-pago';
import { Concepto } from '../../model/concepto';
import { Operacion } from '../../model/operacion';
import { TipoOperacion } from '../../model/tipo-operacion';
import { Entidad } from '../../model/entidad';

// Services
import { ProveedorService } from '../../custom-services/proveedor.service';
import { ResidenteService } from '../../custom-services/residente.service';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { ConceptoService } from '../../custom-services/concepto.service';
import { OperacionService } from '../../custom-services/operacion.service';
import { TipoOperacionService } from '../../custom-services/tipo-operacion.service';
import { FilterService } from './filter.service';
import { PdfService } from './pdf.service';
import { ReporteData } from './reporte-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reportes-operaciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './reportes-operaciones.component.html',
  styleUrl: './reportes-operaciones.component.scss'
})
export class ReportesOperacionesComponent implements OnInit {

  filtroForm: FormGroup;
  reporteData: ReporteData;
  reporteDataView: any[] = [];
  saldo = 0;

  cuentasPorCobrarData: any[] = [];
  cuentasPorPagarData: any[] = [];
  saldoCuentasPorCobrar = 0;
  saldoCuentasPorPagar = 0;

  // Columnas para las tablas
  displayedColumnsResumen: string[] = ['descripcion', 'valor'];
  displayedColumnsView: string[] = ['fecha', 'descripcion', 'importe'];

  // Opciones para los filtros
  opcionesFiltro = {
    conceptos: [] as Concepto[],
    entidades: [] as Entidad[],
    metodosPago: [] as MetodoPago[],
    tiposOperacion: [] as TipoOperacion[]
  };

  private allOperaciones: Operacion[] = [];

  constructor(
    private fb: FormBuilder,
    private operacionService: OperacionService,
    private residenteService: ResidenteService,
    private proveedorService: ProveedorService,
    private conceptoService: ConceptoService,
    private metodoPagoService: MetodoPagoService,
    private tipoOperacionService: TipoOperacionService,
    private filterService: FilterService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      conceptoId: [null],
      entidadId: [null],
      metodoPagoId: [null],
      tipoOperacionId: [null]
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    forkJoin({
      operaciones: this.operacionService.getOperaciones(),
      residentes: this.residenteService.getResidentes(),
      proveedores: this.proveedorService.getProveedores(),
      conceptos: this.conceptoService.getConceptos(),
      metodosPago: this.metodoPagoService.getMetodosPago(),
      tiposOperacion: this.tipoOperacionService.getTiposOperacion()
    }).subscribe(({ operaciones, residentes, proveedores, conceptos, metodosPago, tiposOperacion }) => {
      this.allOperaciones = operaciones;
      this.opcionesFiltro.entidades = [...residentes, ...proveedores];
      this.opcionesFiltro.conceptos = conceptos;
      this.opcionesFiltro.metodosPago = metodosPago;
      this.opcionesFiltro.tiposOperacion = tiposOperacion;
      this.tomarParametrosUrl();
      this.aplicarFiltros(); // Carga inicial
    });
  }
  tomarParametrosUrl() {
    // 👇 NUEVO: leer query params
    this.route.queryParams.pipe(take(1)).subscribe(params => {

      const entidadId = params['entidadId'];
      const conceptoId = params['conceptoId'];
      const metodoPagoId = params['metodoPagoId'];
      const tipoOperacionId = params['tipoOperacionId'];

      if (entidadId) {
        this.filtroForm.get('entidadId')?.setValue(+entidadId);
      }

      if (conceptoId) {
        this.filtroForm.get('conceptoId')?.setValue(+conceptoId);
      }

      if (metodoPagoId) {
        this.filtroForm.get('metodoPagoId')?.setValue(+metodoPagoId);
      }

      if (tipoOperacionId) {
        this.filtroForm.get('tipoOperacionId')?.setValue(+tipoOperacionId);
      }

      // limpiar URL
      if (entidadId || conceptoId || metodoPagoId || tipoOperacionId) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            entidadId: null,
            conceptoId: null,
            metodoPagoId: null,
            tipoOperacionId: null
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

  aplicarFiltros(): void {
    const { reporteData, reporteDataView, saldo } = this.filterService.procesarOperaciones(
      this.allOperaciones,
      this.filtroForm.value
    );
    this.reporteData = reporteData;
    console.log(this.reporteData);
    this.reporteDataView = reporteDataView;
    this.saldo = saldo;

    this.cuentasPorCobrarData = [
      { descripcion: 'Ventas (Generado a favor)', valor: this.reporteData.ventas },
      { descripcion: 'Cobros (Dinero ingresado)', valor: this.reporteData.cobros }
    ];
    this.saldoCuentasPorCobrar = this.reporteData.ventas - this.reporteData.cobros;

    this.cuentasPorPagarData = [
      { descripcion: 'Compras (Deuda generada)', valor: this.reporteData.compras },
      { descripcion: 'Pagos (Dinero egresado)', valor: this.reporteData.pagos }
    ];
    this.saldoCuentasPorPagar = this.reporteData.compras - this.reporteData.pagos;
  }

  resetearFiltros(): void {
    this.filtroForm.reset();
    this.aplicarFiltros();
  }

  descargarPDF(): void {
    this.pdfService.generarPdf(
      this.filtroForm.value,
      this.cuentasPorCobrarData,
      this.saldoCuentasPorCobrar,
      this.cuentasPorPagarData,
      this.saldoCuentasPorPagar,
      this.reporteDataView,
      this.saldo,
      this.opcionesFiltro
    );
  }

}
