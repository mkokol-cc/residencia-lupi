import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Models
import { Concepto } from '../../model/concepto';

@Component({
  selector: 'app-form-concepto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './form-concepto.component.html',
  styleUrl: './form-concepto.component.scss'
})
export class FormConceptoComponent implements OnInit, OnChanges {

  @Input() concepto?: Concepto;
  @Input() conceptosPadre: Concepto[] = [];
  @Output() save = new EventEmitter<Concepto>();
  
  conceptoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.conceptoForm = this.fb.group({
      nombre: ['', Validators.required],
      padreId: [null]
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['concepto']) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    if (!this.concepto) {
      this.conceptoForm.reset();
      return;
    }
    this.conceptoForm.patchValue(this.concepto);
  }

  public submit(): void {
    if (this.conceptoForm.invalid) {
      this.conceptoForm.markAllAsTouched();
      return;
    }

    const formValue = this.conceptoForm.getRawValue();
    const conceptoData: Concepto = {
      ...this.concepto, // Mantiene el id si se está editando
      ...formValue,
      esDeIngreso: false
    };

    this.save.emit(conceptoData);
  }
}