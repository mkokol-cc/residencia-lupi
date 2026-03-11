import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Proveedor } from '../../model/proveedor';
import { FormProveedorComponent } from '../../forms/form-proveedor/form-proveedor.component';

@Component({
  selector: 'app-dialog-proveedor',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormProveedorComponent
  ],
  templateUrl: './dialog-proveedor.component.html',
})
export class DialogProveedorComponent {
  // Obtenemos una referencia al componente del formulario para poder llamarlo
  @ViewChild(FormProveedorComponent) private formComponent!: FormProveedorComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor | undefined
  ) {}

  onSaveClick(): void {
    // Le pedimos al formulario que haga el submit
    this.formComponent.submit();
  }

  handleFormSave(proveedor: Proveedor): void {
    // Cuando el formulario emite el evento 'save', cerramos el diálogo y devolvemos los datos
    this.dialogRef.close(proveedor);
  }
}