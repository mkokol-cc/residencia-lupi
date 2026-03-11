import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Models
import { TipoOperacion } from '../../model/tipo-operacion';

@Component({
  selector: 'app-form-tipo-operacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './form-tipo-operacion.component.html',
})
export class FormTipoOperacionComponent implements OnInit, OnChanges {

  @Input() tipoOperacion?: TipoOperacion;
  @Output() save = new EventEmitter<TipoOperacion>();
  
  tipoOperacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tipoOperacionForm = this.fb.group({
      nombre: ['', Validators.required],
      esEgreso: [false],
      impactaEnCaja: [false]
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoOperacion']) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.tipoOperacion) {
      this.tipoOperacionForm.reset({
        nombre: '',
        esEgreso: false,
        impactaEnCaja: false
      });
      return;
    }
    this.tipoOperacionForm.patchValue(this.tipoOperacion);
  }

  public submit(): void {
    if (this.tipoOperacionForm.invalid) {
      this.tipoOperacionForm.markAllAsTouched();
      return;
    }

    const formValue = this.tipoOperacionForm.getRawValue();
    const tipoOperacionData: TipoOperacion = {
      ...this.tipoOperacion, // Mantiene el id si se está editando
      ...formValue
    };

    this.save.emit(tipoOperacionData);
  }


}
