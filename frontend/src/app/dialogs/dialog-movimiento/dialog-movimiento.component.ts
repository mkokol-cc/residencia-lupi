import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MovimientoSaldo } from '../../model/movimiento-saldo';
import { FormMovimientoComponent } from '../../forms/form-movimiento/form-movimiento.component';
import { Entidad } from '../../model/entidad';
import { Concepto } from '../../model/concepto';

export interface DialogMovimientoData {
  movimiento?: MovimientoSaldo;
  entidades: Entidad[];
  conceptos: Concepto[];
}

@Component({
  selector: 'app-dialog-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormMovimientoComponent
  ],
  templateUrl: './dialog-movimiento.component.html',
})
export class DialogMovimientoComponent {
  @ViewChild(FormMovimientoComponent) private formComponent!: FormMovimientoComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogMovimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMovimientoData
  ) {}

  onSaveClick(): void {
    this.formComponent.submit();
  }

  handleFormSave(movimiento: MovimientoSaldo): void {
    this.dialogRef.close(movimiento);
  }
}