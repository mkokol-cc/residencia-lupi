import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';

// Models
import { Pago } from '../../model/pago';
import { Entidad } from '../../model/entidad';
import { MetodoPago } from '../../model/metodo-pago';

@Component({
  selector: 'app-form-pago',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
  templateUrl: './form-pago.component.html',
  styleUrl: './form-pago.component.scss'
})
export class FormPagoComponent implements OnInit, OnChanges {
  @Input() pago?: Pago;
  @Input() entidades: Entidad[] = [];
  @Input() metodosDePago: MetodoPago[] = [];
  @Output() save = new EventEmitter<Pago>();

  pagoForm: FormGroup;
  filteredEntidades!: Observable<Entidad[]>;

  constructor(private fb: FormBuilder) {
    this.pagoForm = this.fb.group({
      esEntrada: [true, Validators.required],
      esResidencia: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      entidadId: [null], // Opcional. Almacenará el objeto Entidad.
      metodoId: [null, Validators.required],
      fechaHora: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.patchForm();
    this.filteredEntidades = this.pagoForm.get('entidadId')!.valueChanges.pipe(
      startWith(''),
      // El valor puede ser un string (del input) o un objeto Entidad (del patchValue o selección)
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterEntidades(name) : this.entidades.slice()))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-patch form if 'pago' input changes
    if (changes['pago'] && this.pagoForm) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.pago) {
      this.pagoForm.reset({ esEntrada: true, fechaHora: new Date(), esResidencia: null });
      return;
    }
    this.pagoForm.patchValue({
      ...this.pago,
      entidadId: this.pago.entidad,
      metodoId: this.pago.metodo?.id,
    });
  }

  displayEntidad(entidad: Entidad): string {
    return entidad && entidad.nombre ? entidad.nombre : '';
  }

  private _filterEntidades(value: string): Entidad[] {
    const filterValue = value.toLowerCase();
    return this.entidades.filter(entidad =>
      entidad.nombre.toLowerCase().includes(filterValue) ||
      (entidad.dniCuit && entidad.dniCuit.toLowerCase().includes(filterValue))
    );
  }

  public submit(): void {
    if (this.pagoForm.invalid) { this.pagoForm.markAllAsTouched(); return; }

    const formValue = this.pagoForm.getRawValue();
    const pagoData: Pago = {
      id: this.pago?.id,
      esEntrada: formValue.esEntrada, 
      esResidencia: formValue.esResidencia,
      monto: formValue.monto,
      fechaHora: formValue.fechaHora,
      entidad: formValue.entidadId, // El form control ahora tiene el objeto completo
      metodo: this.metodosDePago.find(m => m.id === formValue.metodoId)!,
    };

    this.save.emit(pagoData);
  }
}
