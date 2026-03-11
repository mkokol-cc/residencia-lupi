import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { TipoOperacion } from '../../model/tipo-operacion';
import { DialogTipoOperacionComponent, DialogTipoOperacionData } from '../../dialogs/dialog-tipo-operacion/dialog-tipo-operacion.component';
import { TipoOperacionService } from '../../custom-services/tipo-operacion.service'; // Asegúrate de crear este servicio
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';

@Component({
  selector: 'app-crud-tipo-operacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatPaginatorModule,
    NoDataTemplateComponent
  ],
  templateUrl: './crud-tipo-operacion.component.html'
})
export class CrudTipoOperacionComponent implements OnInit {
  filterForm!: FormGroup;
  tiposOperacion: TipoOperacion[] = [];

  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private tipoOperacionService: TipoOperacionService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: ['']
    });

    this.cargarTiposOperacion();
  }

  cargarTiposOperacion(): void {
    const search = this.filterForm.get('search')?.value || '';
    this.tipoOperacionService.searchTiposOperacion(search, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.tiposOperacion = data.content;
        this.totalElements = data.totalElements;
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.cargarTiposOperacion();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarTiposOperacion();
  }

  abrirDialogo(tipoOperacion?: TipoOperacion): void {
    const dialogData: DialogTipoOperacionData = { tipoOperacion };

    const dialogRef = this.dialog.open(DialogTipoOperacionComponent, {
      width: '450px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarTipoOperacion(result);
      }
    });
  }

  private guardarTipoOperacion(tipoOperacion: TipoOperacion): void {
    this.tipoOperacionService.guardar(tipoOperacion).subscribe({
      next: () => {
        this.snackBar.open('Tipo de operación guardado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarTiposOperacion();
      },
      error: (err) => this.snackBar.open('Error al guardar el tipo de operación', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarTipoOperacion(id: number): void {
    if (confirm('¿Estás seguro de eliminar este tipo de operación?')) {
      this.tipoOperacionService.eliminar(id).subscribe(() => {
        this.snackBar.open('Tipo de operación eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarTiposOperacion();
      });
    }
  }
}
