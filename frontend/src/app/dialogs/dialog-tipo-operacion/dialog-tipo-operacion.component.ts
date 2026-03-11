import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TipoOperacion } from '../../model/tipo-operacion';
import { FormTipoOperacionComponent } from '../../forms/form-tipo-operacion/form-tipo-operacion.component';

export interface DialogTipoOperacionData {
  tipoOperacion?: TipoOperacion;
}

@Component({
  selector: 'app-dialog-tipo-operacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormTipoOperacionComponent
  ],
  templateUrl: './dialog-tipo-operacion.component.html'
})
export class DialogTipoOperacionComponent {
  @ViewChild(FormTipoOperacionComponent) formComponent!: FormTipoOperacionComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogTipoOperacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTipoOperacionData
  ) {}

  onSave(tipoOperacion: TipoOperacion): void {
    this.dialogRef.close(tipoOperacion);
  }
}
