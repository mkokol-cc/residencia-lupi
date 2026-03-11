import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Residente } from '../../model/residente';
import { Proveedor } from '../../model/proveedor';
import { MetodoPago } from '../../model/metodo-pago';
import { Concepto } from '../../model/concepto';
import { Pago } from '../../model/pago';
import { MovimientoSaldo } from '../../model/movimiento-saldo';

// Services
import { PagoService } from '../../custom-services/pago.service';
import { MovimientoSaldoService } from '../../custom-services/movimiento-saldo.service';
import { ProveedorService } from '../../custom-services/proveedor.service';
import { ResidenteService } from '../../custom-services/residente.service';
import { MetodoPagoService } from '../../custom-services/metodo-pago.service';
import { ConceptoService } from '../../custom-services/concepto.service';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {

  filtroForm: FormGroup;
  reporteData: any[] = [];
  reporteDataView: any[] = [];
  displayedColumns: string[] = ['descripcion', 'valor'];
  displayedColumnsView: string[] = ['fecha', 'descripcion', 'importe']; // Keep this for header and data rows
  saldo: number = 0; // Added for total balance

  // Data sources
  private allPagos: Pago[] = [];
  private allMovimientos: MovimientoSaldo[] = [];

  // --- Opciones para los Selects de Filtros ---
  opcionesFiltro = {
    metodosPago: [] as MetodoPago[],
    proveedores: [] as Proveedor[],
    conceptos: [] as Concepto[],
    residentes: [] as Residente[]
  };

  // --- Controles y Observables para Autocomplete ---
  proveedorCtrl = new FormControl('');
  conceptoCtrl = new FormControl('');
  residenteCtrl = new FormControl('');

  filteredProveedores!: Observable<Proveedor[]>;
  filteredConceptos!: Observable<Concepto[]>;
  filteredResidentes!: Observable<Residente[]>;

  selectedProveedores: Proveedor[] = [];
  selectedConceptos: Concepto[] = [];
  selectedResidentes: Residente[] = [];

  @ViewChild('proveedorInput') proveedorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('conceptoInput') conceptoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('residenteInput') residenteInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private movimientoService: MovimientoSaldoService,
    private proveedorService: ProveedorService,
    private residenteService: ResidenteService,
    private metodoPagoService: MetodoPagoService,
    private conceptoService: ConceptoService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.filtroForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      metodosPago: [[]],
      proveedores: [[]],
      conceptos: [[]],
      residentes: [[]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    forkJoin({
      pagos: this.pagoService.getPagos(),
      movimientos: this.movimientoService.getMovimientos(),
      metodosPago: this.metodoPagoService.getMetodosPago(),
      proveedores: this.proveedorService.getProveedores(),
      residentes: this.residenteService.getResidentes(),
      conceptos: this.conceptoService.getConceptos()
    }).subscribe(({ pagos, movimientos, metodosPago, proveedores, residentes, conceptos }) => {
      // Store data sources
      this.allPagos = pagos;
      this.allMovimientos = movimientos;

      // Populate filter options
      this.opcionesFiltro.metodosPago = metodosPago;
      this.opcionesFiltro.proveedores = proveedores;
      this.opcionesFiltro.residentes = residentes;
      this.opcionesFiltro.conceptos = conceptos;

      console.log("Por Filtrar")

      // Inicializar filtros de autocomplete
      this.initAutocompleteFilters();

      // Revisa si hay parametros en los query params para aplicar el filtro
      this.route.queryParams.pipe(take(1)).subscribe(params => {
        const proveedorId = params['proveedorId'];
        const residenteId = params['residenteId'];
        const conceptoId = params['conceptoId'];

        if (proveedorId) {
          const proveedor = this.opcionesFiltro.proveedores.find(p => p.id === +proveedorId);
          if (proveedor) {
            this.selectedProveedores = [proveedor];
            this.filtroForm.get('proveedores')?.setValue([proveedor.id]);
          }
        }
        
        if (residenteId) {
          const residente = this.opcionesFiltro.residentes.find(r => r.id === +residenteId);
          if (residente) {
            this.selectedResidentes = [residente];
            this.filtroForm.get('residentes')?.setValue([residente.id]);
          }
        }

        if (conceptoId) {
          const concepto = this.opcionesFiltro.conceptos.find(c => c.id === +conceptoId);
          if (concepto) {
            this.selectedConceptos = [concepto];
            this.filtroForm.get('conceptos')?.setValue([concepto.id]);
          }
        }

        if (proveedorId || residenteId || conceptoId) {
          // Limpia los query params de la URL para no mantener el estado en el refresco
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { proveedorId: null, residenteId: null, conceptoId: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }
        
        // Aplica los filtros (con el proveedor preseleccionado o vacíos)
        this.aplicarFiltros();
      });
    });
  }

  initAutocompleteFilters(): void {
    this.filteredProveedores = this.proveedorCtrl.valueChanges.pipe(
      startWith(null),
      map((valor: string | null) => valor ? this._filterProveedores(valor) : this.opcionesFiltro.proveedores.slice())
    );

    this.filteredConceptos = this.conceptoCtrl.valueChanges.pipe(
      startWith(null),
      map((valor: string | null) => valor ? this._filterConceptos(valor) : this.opcionesFiltro.conceptos.slice())
    );

    this.filteredResidentes = this.residenteCtrl.valueChanges.pipe(
      startWith(null),
      map((valor: string | null) => valor ? this._filterResidentes(valor) : this.opcionesFiltro.residentes.slice())
    );
  }

  // --- Funciones de Filtrado ---
  private _filterProveedores(value: string): Proveedor[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.opcionesFiltro.proveedores.filter(p => p.nombre.toLowerCase().includes(filterValue));
  }

  private _filterConceptos(value: string): Concepto[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.opcionesFiltro.conceptos.filter(c => c.nombre.toLowerCase().includes(filterValue));
  }

  private _filterResidentes(value: string): Residente[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.opcionesFiltro.residentes.filter(r => 
      (r.nombre + ' ' + r.apellido).toLowerCase().includes(filterValue) || 
      r.dniCuit.includes(filterValue)
    );
  }

  // --- Manejo de Selección (Chips) ---
  
  // Proveedores
  selectProveedor(event: MatAutocompleteSelectedEvent): void {
    const proveedor = event.option.value;
    if (!this.selectedProveedores.find(p => p.id === proveedor.id)) {
      this.selectedProveedores.push(proveedor);
      this.filtroForm.get('proveedores')?.setValue(this.selectedProveedores.map(p => p.id));
    }
    this.proveedorInput.nativeElement.value = '';
    this.proveedorCtrl.setValue(null);
  }
  removeProveedor(proveedor: Proveedor): void {
    this.selectedProveedores = this.selectedProveedores.filter(p => p.id !== proveedor.id);
    this.filtroForm.get('proveedores')?.setValue(this.selectedProveedores.map(p => p.id));
  }

  // Conceptos
  selectConcepto(event: MatAutocompleteSelectedEvent): void {
    const concepto = event.option.value;
    if (!this.selectedConceptos.find(c => c.id === concepto.id)) {
      this.selectedConceptos.push(concepto);
      this.filtroForm.get('conceptos')?.setValue(this.selectedConceptos.map(c => c.id));
    }
    this.conceptoInput.nativeElement.value = '';
    this.conceptoCtrl.setValue(null);
  }
  removeConcepto(concepto: Concepto): void {
    this.selectedConceptos = this.selectedConceptos.filter(c => c.id !== concepto.id);
    this.filtroForm.get('conceptos')?.setValue(this.selectedConceptos.map(c => c.id));
  }

  // Residentes
  selectResidente(event: MatAutocompleteSelectedEvent): void {
    const residente = event.option.value;
    if (!this.selectedResidentes.find(r => r.id === residente.id)) {
      this.selectedResidentes.push(residente);
      this.filtroForm.get('residentes')?.setValue(this.selectedResidentes.map(r => r.id));
    }
    this.residenteInput.nativeElement.value = '';
    this.residenteCtrl.setValue(null);
  }
  removeResidente(residente: Residente): void {
    this.selectedResidentes = this.selectedResidentes.filter(r => r.id !== residente.id);
    this.filtroForm.get('residentes')?.setValue(this.selectedResidentes.map(r => r.id));
  }

  aplicarFiltros(): void {
    const filtros = this.filtroForm.value;

    // 1. Procesar y filtrar Pagos
    const pagosFiltrados = this.allPagos.filter(pago => {
      const fecha = new Date(pago.fechaHora);
      const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
      const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;
      if (fechaDesde) fechaDesde.setHours(0, 0, 0, 0);
      if (fechaHasta) fechaHasta.setHours(23, 59, 59, 999);

      const fechaOk = (!fechaDesde || fecha >= fechaDesde) && (!fechaHasta || fecha <= fechaHasta);
      const metodoOk = !filtros.metodosPago.length || filtros.metodosPago.includes(pago.metodo.id);
      
      const entidadId = (pago.entidad as any)?.id;
      const noEntityFilters = !filtros.proveedores.length && !filtros.residentes.length;
      const proveedorMatch = filtros.proveedores.length && filtros.proveedores.includes(entidadId);
      const residenteMatch = filtros.residentes.length && filtros.residentes.includes(entidadId);
      const entidadOk = noEntityFilters || proveedorMatch || residenteMatch;

      return fechaOk && metodoOk && entidadOk;
    });

    let movimientosFiltrados: MovimientoSaldo[] = [];
    // Si no se está filtrando por método de pago, se incluyen los movimientos de saldo.
    if (!filtros.metodosPago || filtros.metodosPago.length === 0) {
      // 2. Procesar y filtrar Movimientos de Saldo
      movimientosFiltrados = this.allMovimientos.filter(mov => {
        const fecha = new Date(mov.fechaHora);
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;
        if (fechaDesde) fechaDesde.setHours(0, 0, 0, 0);
        if (fechaHasta) fechaHasta.setHours(23, 59, 59, 999);

        const fechaOk = (!fechaDesde || fecha >= fechaDesde) && (!fechaHasta || fecha <= fechaHasta);
        const conceptoOk = !filtros.conceptos.length || (mov.concepto && filtros.conceptos.includes(mov.concepto.id));

        const entidadId = (mov.entidad as any)?.id;
        const noEntityFilters = !filtros.proveedores.length && !filtros.residentes.length;
        const proveedorMatch = filtros.proveedores.length && filtros.proveedores.includes(entidadId);
        const residenteMatch = filtros.residentes.length && filtros.residentes.includes(entidadId);
        const entidadOk = noEntityFilters || proveedorMatch || residenteMatch;

        return fechaOk && conceptoOk && entidadOk;
      });
    }

    this.reporteDataView = [
      ...movimientosFiltrados.map(m => ({ ...m, tipo: 'MOVIMIENTO', signedMonto: m.esEntrada ? m.monto : -m.monto })),
      ...pagosFiltrados.map(p => ({ ...p, tipo: 'PAGO', signedMonto: p.esEntrada ? p.monto : -p.monto }))
    ];
    this.reporteDataView.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

    // 3. Calcular valores para el reporte
    const ingresosMovimientosSaldo = movimientosFiltrados
      .filter(m => m.esEntrada)
      .reduce((sum, m) => sum + m.monto, 0);

    const egresosPagos = pagosFiltrados
      .filter(p => !p.esEntrada)
      .reduce((sum, p) => sum + p.monto, 0);

    const totalSubgrupo1 = egresosPagos - ingresosMovimientosSaldo;

    const egresosMovimientosSaldo = movimientosFiltrados
      .filter(m => !m.esEntrada)
      .reduce((sum, m) => sum + m.monto, 0);

    const ingresosPagos = pagosFiltrados
      .filter(p => p.esEntrada)
      .reduce((sum, p) => sum + p.monto, 0);

    const totalSubgrupo2 = egresosMovimientosSaldo - ingresosPagos;

    // 4. Construir el dataSource para la tabla de resumen
    this.reporteData = [
      { descripcion: 'Liquidacion - Devengamiento - Venta', valor: egresosMovimientosSaldo },
      { descripcion: 'Pagos', valor: egresosPagos },
      { descripcion: 'TOTAL', valor: (egresosMovimientosSaldo-egresosPagos), esTotal: true },
      { descripcion: 'Compras', valor: ingresosMovimientosSaldo },
      { descripcion: 'Cobros', valor: ingresosPagos },
      { descripcion: 'TOTAL', valor: (ingresosMovimientosSaldo-ingresosPagos), esTotal: true }
    ];

    // Calculate the overall saldo from reporteDataView
    this.saldo = this.reporteDataView.reduce((sum, item) => sum + item.signedMonto, 0);
  }

  resetearFiltros(): void {
    this.filtroForm.reset({
      fechaDesde: null, fechaHasta: null, metodosPago: [], proveedores: [], conceptos: [], residentes: []
    });
    
    this.selectedProveedores = [];
    this.selectedConceptos = [];
    this.selectedResidentes = [];
    
    this.aplicarFiltros();
  }

  getMovimientoDescription(element: Pago | MovimientoSaldo): string {
    // Revisa si es un 'Pago' por la propiedad 'metodo'
    if ('metodo' in element) {
      const entidad = (element.entidad as any);
      const nombreEntidad = entidad?.nombre ? `${entidad.nombre} ${entidad.apellido || ''}`.trim() : 'N/A';
      return `Pago a ${nombreEntidad}`;
    }
    // Revisa si es un 'MovimientoSaldo'
    if ('concepto' in element) {
      const concepto = element.concepto?.nombre || 'Concepto no especificado';
      return `Movimiento por ${concepto}`;
    }
    return 'Descripción no disponible';
  }

  descargarPDF(): void {
    const doc = new jsPDF();
    const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
    const dateFormatter = new Intl.DateTimeFormat('es-AR');

    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Movimientos', 14, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${dateFormatter.format(new Date())}`, 14, 28);

    let finalY = 35;

    // --- Leyenda de Filtros ---
    doc.setFontSize(9);
    doc.setTextColor(100); // Gris oscuro para diferenciar del contenido
    
    const filtros = this.filtroForm.value;
    const activeFilters: string[] = [];

    if (filtros.fechaDesde) activeFilters.push(`Desde: ${dateFormatter.format(new Date(filtros.fechaDesde))}`);
    if (filtros.fechaHasta) activeFilters.push(`Hasta: ${dateFormatter.format(new Date(filtros.fechaHasta))}`);
    
    if (filtros.metodosPago && filtros.metodosPago.length > 0) {
       const metodos = this.opcionesFiltro.metodosPago
         .filter(m => filtros.metodosPago.includes(m.id))
         .map(m => m.nombre)
         .join(', ');
       activeFilters.push(`Métodos: ${metodos}`);
    }
    if (this.selectedProveedores.length > 0) {
       activeFilters.push(`Proveedores: ${this.selectedProveedores.map(p => p.nombre).join(', ')}`);
    }
    if (this.selectedConceptos.length > 0) {
       activeFilters.push(`Conceptos: ${this.selectedConceptos.map(c => c.nombre).join(', ')}`);
    }
    if (this.selectedResidentes.length > 0) {
       activeFilters.push(`Residentes: ${this.selectedResidentes.map(r => `${r.apellido}, ${r.nombre}`).join(', ')}`);
    }

    const filterText = activeFilters.length > 0 ? `Filtros aplicados: ${activeFilters.join(' | ')}` : 'Filtros aplicados: Ninguno (Mostrando todo)';
    const splitText = doc.splitTextToSize(filterText, 180); // Ajustar al ancho de la página (A4 ~210mm - márgenes)
    doc.text(splitText, 14, finalY);
    
    doc.setTextColor(0); // Resetear color a negro
    finalY += (splitText.length * 5) + 10; // Ajustar posición Y para la siguiente tabla

    // 1. Tabla de Resumen (si hay datos)
    if (this.reporteData && this.reporteData.length > 0) {
      doc.setFontSize(14);
      doc.text('Resumen', 14, finalY);
      finalY += 5;

      autoTable(doc, {
        startY: finalY,
        head: [['Descripción', 'Valor']],
        body: this.reporteData.map(item => [
          item.descripcion,
          currencyFormatter.format(item.valor)
        ]),
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: {
          1: { halign: 'right' }
        },
        didParseCell: (data) => {
          // Negrita y fondo gris para filas de TOTAL
          const item = this.reporteData[data.row.index];
          if (data.section === 'body' && item && item.esTotal) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 220, 220];
          }
        }
      });
      
      // Actualizar posición Y para la siguiente tabla
      finalY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 2. Tabla de Movimientos (si hay datos)
    if (this.reporteDataView && this.reporteDataView.length > 0) {
      doc.setFontSize(14);
      doc.text('Detalle de Movimientos', 14, finalY);
      finalY += 5;

      const saldoFormatted = (this.saldo > 0 ? '+' : '') + currencyFormatter.format(this.saldo);

      autoTable(doc, {
        startY: finalY,
        head: [['Fecha', 'Descripción', 'Importe']],
        body: this.reporteDataView.map(element => {
          const fecha = dateFormatter.format(new Date(element.fechaHora));
          
          // Construir descripción similar al HTML
          let desc = `${element.esResidencia ? 'Residencia' : 'Personal'} ${element.tipo}: ${element.esEntrada ? 'Entrada' : 'Salida'}`;
          if (element.concepto?.padre) {
            desc += `\n${element.concepto.padre.nombre} > ${element.concepto.nombre}`;
          } else if (element.concepto?.nombre) {
            desc += `\n${element.concepto.nombre}`;
          }
          if (element.descripcion) {
            desc += `\n${element.descripcion}`;
          }

          const importe = (element.signedMonto > 0 ? '+' : '') + currencyFormatter.format(element.signedMonto);
          return [fecha, desc, importe];
        }),
        foot: [['', 'SALDO:', saldoFormatted]],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: {
          0: { cellWidth: 25 },
          2: { halign: 'right', cellWidth: 40 }
        },
        footStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'right'
        },
        didParseCell: (data) => {
          // Colorear importe en body (Verde/Rojo)
          if (data.section === 'body' && data.column.index === 2) {
            const item = this.reporteDataView[data.row.index];
            if (item.signedMonto > 0) data.cell.styles.textColor = [0, 128, 0];
            else if (item.signedMonto < 0) data.cell.styles.textColor = [255, 0, 0];
          }
          // Colorear saldo en footer
          if (data.section === 'foot' && data.column.index === 2) {
             if (this.saldo > 0) data.cell.styles.textColor = [0, 128, 0];
             else if (this.saldo < 0) data.cell.styles.textColor = [255, 0, 0];
          }
        }
      });
    }

    doc.save('reporte-movimientos.pdf');
  }
}
