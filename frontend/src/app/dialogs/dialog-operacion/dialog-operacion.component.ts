import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Operacion } from '../../model/operacion';
import { FormOperacionComponent } from '../../forms/form-operacion/form-operacion.component';
import { Entidad } from '../../model/entidad';
import { Concepto } from '../../model/concepto';
import { TipoOperacion } from '../../model/tipo-operacion';
import { MetodoPago } from '../../model/metodo-pago';

export interface DialogOperacionData {
  operacion?: Operacion;
  entidades: Entidad[];
  conceptos: Concepto[];
  tiposOperacion: TipoOperacion[];
  metodosPago: MetodoPago[];
}

@Component({
  selector: 'app-dialog-operacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormOperacionComponent
  ],
  templateUrl: './dialog-operacion.component.html',
})
export class DialogOperacionComponent {
  @ViewChild(FormOperacionComponent) private formComponent!: FormOperacionComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogOperacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogOperacionData
  ) {}

  onSaveClick(): void { this.formComponent.submit(); }
  handleFormSave(operacion: Operacion): void { this.dialogRef.close(operacion); }
}