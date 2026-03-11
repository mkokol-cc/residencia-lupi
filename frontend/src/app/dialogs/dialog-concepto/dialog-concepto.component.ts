import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Concepto } from '../../model/concepto';
import { FormConceptoComponent } from '../../forms/form-concepto/form-concepto.component';

export interface DialogConceptoData {
  concepto?: Concepto;
  conceptosPadre: Concepto[];
}

@Component({
  selector: 'app-dialog-concepto',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormConceptoComponent
  ],
  templateUrl: './dialog-concepto.component.html',
})
export class DialogConceptoComponent {
  @ViewChild(FormConceptoComponent) private formComponent!: FormConceptoComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogConceptoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConceptoData
  ) {}

  onSaveClick(): void {
    this.formComponent.submit();
  }

  handleFormSave(concepto: Concepto): void {
    this.dialogRef.close(concepto);
  }
}