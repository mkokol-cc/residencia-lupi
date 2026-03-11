import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Residente } from '../../model/residente';
import { FormResidenteComponent } from '../../forms/form-residente/form-residente.component';

@Component({
  selector: 'app-dialog-residente',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormResidenteComponent
  ],
  templateUrl: './dialog-residente.component.html',
})
export class DialogResidenteComponent {
  @ViewChild(FormResidenteComponent) private formComponent!: FormResidenteComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogResidenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Residente | undefined
  ) {}

  onSaveClick(): void {
    this.formComponent.submit();
  }

  handleFormSave(residente: Residente): void {
    this.dialogRef.close(residente);
  }
}