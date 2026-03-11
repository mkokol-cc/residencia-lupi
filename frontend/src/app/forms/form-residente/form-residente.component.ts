import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

// Models
import { Residente } from '../../model/residente';

@Component({
  selector: 'app-form-residente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './form-residente.component.html',
  styleUrl: './form-residente.component.scss'
})
export class FormResidenteComponent implements OnInit, OnChanges {
  @Input() residente?: Residente;
  @Output() save = new EventEmitter<Residente>();

  residenteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.residenteForm = this.fb.group({
      nombrePila: ['', Validators.required],
      apellido: ['', Validators.required],
      dniCuit: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      fechaIngreso: [null, Validators.required],
      esActivo: [true],
      nota: [''],
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residente']) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.residente) {
      this.residenteForm.reset({ esActivo: true });
      return;
    }
    this.residenteForm.patchValue(this.residente);
  }

  public submit(): void {
    if (this.residenteForm.invalid) {
      this.residenteForm.markAllAsTouched();
      return;
    }

    const formValue = this.residenteForm.getRawValue();
    const residenteData: Residente = {
      ...this.residente, // Mantiene propiedades no editables como el id
      ...formValue,
      dniCuit: (formValue.dniCuit || '').toString(), // Cumple con la interfaz Entidad
    };

    this.save.emit(residenteData);
  }
}
