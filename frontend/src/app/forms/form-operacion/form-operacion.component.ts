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
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Models
import { Operacion } from '../../model/operacion';
import { Entidad } from '../../model/entidad';
import { Concepto } from '../../model/concepto';
import { TipoOperacion } from '../../model/tipo-operacion';
import { MetodoPago } from '../../model/metodo-pago';
import { OperacionFormData } from './operacion-form-data';
import { NgxCurrencyDirective } from "ngx-currency";

@Component({
  selector: 'app-form-operacion',
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
    CdkTextareaAutosize,
    MatCheckboxModule,
    NgxCurrencyDirective
  ],
  templateUrl: './form-operacion.component.html',
  styleUrl: './form-operacion.component.scss'
})
export class FormOperacionComponent implements OnInit, OnChanges {
  @Input() operacion?: Operacion;
  @Input() entidades: Entidad[] = [];
  @Input() conceptos: Concepto[] = [];
  @Input() tiposOperacion: TipoOperacion[] = [];
  @Input() metodosPago: MetodoPago[] = [];
  @Output() save = new EventEmitter<Operacion>();

  operacionForm: FormGroup;
  filteredEntidades!: Observable<Entidad[]>;
  filteredConceptos!: Observable<Concepto[]>;
  filteredTiposOperacion!: Observable<TipoOperacion[]>;

  constructor(private fb: FormBuilder) {
    this.operacionForm = this.fb.group({
      id: [null],
      tipoOperacion: [null, Validators.required],
      esResidencia: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      entidad: [null],
      concepto: [null],
      metodo: [{ value: null, disabled: true }],
      fechaHora: [new Date(), Validators.required],
      descripcion: [''],
      pagado: [{ value: false, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.setupFilters();
    this.setupConditionalFields();
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operacion'] && this.operacionForm) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.operacion) {
      this.operacionForm.reset({ fechaHora: new Date(), esResidencia: null, pagado: false });
      return;
    }

    const isPaid = !!this.operacion.metodo;
    const pagadoValue = this.operacion.tipoOperacion && !this.operacion.tipoOperacion.impactaEnCaja && isPaid;

    this.operacionForm.patchValue({
      ...this.operacion,
      pagado: pagadoValue
    });
  }

  private setupConditionalFields(): void {
    this.operacionForm.get('tipoOperacion')!.valueChanges.subscribe(() => this.updateFieldStates());
    this.operacionForm.get('pagado')!.valueChanges.subscribe(() => this.updateFieldStates());
  }

  private updateFieldStates(): void {
    const tipoOperacion = this.operacionForm.get('tipoOperacion')?.value as TipoOperacion;
    const pagadoControl = this.operacionForm.get('pagado');
    const metodoControl = this.operacionForm.get('metodo');

    if (tipoOperacion && typeof tipoOperacion === 'object') {
        if (tipoOperacion.impactaEnCaja) {
            pagadoControl.disable({ emitEvent: false });
            pagadoControl.setValue(false, { emitEvent: false });
            
            metodoControl.enable();
            metodoControl.setValidators(Validators.required);
        } else {
            pagadoControl.enable({ emitEvent: false });
            if (pagadoControl.value) {
                metodoControl.enable();
                metodoControl.setValidators(Validators.required);
            } else {
                metodoControl.disable();
                metodoControl.clearValidators();
                metodoControl.reset(null, { emitEvent: false });
            }
        }
    }
  }

  private setupFilters(): void {
    this.filteredEntidades = this.operacionForm.get('entidad')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterEntidades(name) : this.entidades.slice()))
    );

    this.filteredConceptos = this.operacionForm.get('concepto')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterConceptos(name) : this.conceptos.slice()))
    );

    this.filteredTiposOperacion = this.operacionForm.get('tipoOperacion')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.nombre)),
      map(name => (name ? this._filterTiposOperacion(name) : this.tiposOperacion.slice()))
    );
  }

  displayEntidad = (entidad: Entidad): string => entidad?.nombre || '';
  displayConcepto = (concepto: Concepto): string => concepto?.nombre || '';
  displayTipoOperacion = (tipo: TipoOperacion): string => tipo?.nombre || '';

  private _filterEntidades = (value: string): Entidad[] => this.entidades.filter(e => e.nombre.toLowerCase().includes(value.toLowerCase()));
  private _filterConceptos = (value: string): Concepto[] => this.conceptos.filter(c => c.nombre.toLowerCase().includes(value.toLowerCase()));
  private _filterTiposOperacion = (value: string): TipoOperacion[] => this.tiposOperacion.filter(t => t.nombre?.toLowerCase().includes(value.toLowerCase()));

  public submit(): void {
    if (this.operacionForm.invalid) {
      this.operacionForm.markAllAsTouched();
      return;
    }

    const formValue = this.operacionForm.getRawValue();
    const operacionData: OperacionFormData = {
      ...this.operacion,
      ...formValue
    };

    this.save.emit(operacionData);
  }
}