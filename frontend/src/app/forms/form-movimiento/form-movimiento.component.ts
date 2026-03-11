import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Concepto } from '../../model/concepto';
import { Entidad } from '../../model/entidad';
import { MovimientoSaldo } from '../../model/movimiento-saldo';


@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './form-movimiento.component.html',
  styleUrl: './form-movimiento.component.scss'
})
export class FormMovimientoComponent implements OnInit, OnChanges {
  @Input() movimiento?: MovimientoSaldo;
  @Input() entidades: Entidad[] = [];
  @Input() conceptos: Concepto[] = [];
  @Output() save = new EventEmitter<MovimientoSaldo>();

  movimientoForm: FormGroup;
  filteredEntidades!: Observable<Entidad[]>;
  filteredConceptos!: Observable<Concepto[]>;

  constructor(private fb: FormBuilder) {
    this.movimientoForm = this.fb.group({
      esEntrada: [true, Validators.required],
      esResidencia: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      entidadId: [null], // Almacenará el objeto Entidad
      conceptoId: [null], // Almacenará el objeto Concepto
      fechaHora: [new Date(), Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.patchForm();

    this.filteredEntidades = this.movimientoForm.get('entidadId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterEntidades(name) : this.entidades.slice()))
    );

    this.filteredConceptos = this.movimientoForm.get('conceptoId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterConceptos(name) : this.conceptos.slice()))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-patch form if 'movimiento' input changes
    if (changes['movimiento'] && this.movimientoForm) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.movimiento) {
      this.movimientoForm.reset({ esEntrada: true, fechaHora: new Date(), esResidencia: null });
      return;
    }
    this.movimientoForm.patchValue({
      ...this.movimiento,
      entidadId: this.movimiento.entidad,
      conceptoId: this.movimiento.concepto,
    });
  }

  displayEntidad(entidad: Entidad): string {
    return entidad && entidad.nombre ? entidad.nombre : '';
  }

  displayConcepto(concepto: Concepto): string {
    return concepto && concepto.nombre ? concepto.nombre : '';
  }

  private _filterEntidades(value: string): Entidad[] {
    const filterValue = value.toLowerCase();
    return this.entidades.filter(entidad =>
      entidad.nombre.toLowerCase().includes(filterValue) ||
      (entidad.dniCuit && entidad.dniCuit.toLowerCase().includes(filterValue))
    );
  }

  private _filterConceptos(value: string): Concepto[] {
    const filterValue = value.toLowerCase();
    return this.conceptos.filter(concepto =>
      concepto.nombre.toLowerCase().includes(filterValue)
    );
  }

  public submit(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    const formValue = this.movimientoForm.getRawValue();
    const movimientoData: MovimientoSaldo = {
      ...this.movimiento,
      esEntrada: formValue.esEntrada,
      esResidencia: formValue.esResidencia,
      monto: formValue.monto,
      fechaHora: formValue.fechaHora,
      descripcion: formValue.descripcion,
      entidad: formValue.entidadId, // El form control ahora tiene el objeto completo
      concepto: formValue.conceptoId, // El form control ahora tiene el objeto completo
    };

    this.save.emit(movimientoData);
  }
}
