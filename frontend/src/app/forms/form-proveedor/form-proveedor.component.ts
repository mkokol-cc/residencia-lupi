import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Models
import { Proveedor } from '../../model/proveedor';

@Component({
  selector: 'app-form-proveedor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './form-proveedor.component.html',
  styleUrl: './form-proveedor.component.scss'
})
export class FormProveedorComponent implements OnInit, OnChanges {
  @Input() proveedor?: Proveedor;
  @Output() save = new EventEmitter<Proveedor>();

  proveedorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      dniCuit: [null, [Validators.pattern('^[0-9]{11}$')]],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedor']) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.proveedor) {
      this.proveedorForm.reset();
      return;
    }
    this.proveedorForm.patchValue(this.proveedor);
  }

  public submit(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const formValue = this.proveedorForm.getRawValue();
    const proveedorData: Proveedor = {
      ...this.proveedor, // Mantiene el id si se está editando
      ...formValue,
      dniCuit: formValue.dniCuit, // Cumple con la interfaz Entidad
    };

    this.save.emit(proveedorData);
  }
}
