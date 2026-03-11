import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Pago } from '../../model/pago';
import { FormPagoComponent } from '../../forms/form-pago/form-pago.component';
import { Entidad } from '../../model/entidad';
import { MetodoPago } from '../../model/metodo-pago';

export interface DialogPagoData {
  pago?: Pago;
  entidades: Entidad[];
  metodosDePago: MetodoPago[];
}
@Component({
  selector: 'app-dialog-pago',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormPagoComponent
  ],
  templateUrl: './dialog-pago.component.html',
})
export class DialogPagoComponent {
  @ViewChild(FormPagoComponent) private formComponent!: FormPagoComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogPagoData
  ) {}

  onSaveClick(): void {
    this.formComponent.submit();
  }

  handleFormSave(pago: Pago): void {
    this.dialogRef.close(pago);
  }
}