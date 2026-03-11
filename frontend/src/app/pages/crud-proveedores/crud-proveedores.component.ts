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
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

// Componentes y Modelos
import { Proveedor } from '../../model/proveedor';
import { DialogProveedorComponent } from '../../dialogs/dialog-proveedor/dialog-proveedor.component';
import { ProveedorService } from '../../custom-services/proveedor.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';

@Component({
  selector: 'app-crud-proveedores',
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
    MatSelectModule,
    NoDataTemplateComponent
  ],
  templateUrl: './crud-proveedores.component.html'
})
export class CrudProveedoresComponent implements OnInit {
  filterForm!: FormGroup;
  proveedores: Proveedor[] = [];

  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      orden: ['nombre,asc']
    });

    this.cargarProveedores();
  }

  cargarProveedores(): void {
    const { search, orden } = this.filterForm.value;
    this.proveedorService.searchProveedores(search, this.pageIndex, this.pageSize, orden)
      .subscribe(data => {
        this.proveedores = data.content;
        this.totalElements = data.totalElements;
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.cargarProveedores();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarProveedores();
  }

  abrirDialogo(proveedor?: Proveedor): void {
    const dialogRef = this.dialog.open(DialogProveedorComponent, {
      width: '450px',
      data: proveedor // Pasamos el proveedor a editar, o undefined si es nuevo
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el usuario guardó (result no es null/undefined)
      if (result) {
        this.guardarProveedor(result);
      }
    });
  }

  private guardarProveedor(proveedor: Proveedor): void {
    this.proveedorService.guardarProveedor(proveedor).subscribe({
      next: () => {
        this.snackBar.open('Proveedor guardado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarProveedores();
      },
      error: (err) => this.snackBar.open('Error al guardar el proveedor', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarProveedor(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.snackBar.open('Proveedor eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarProveedores();
      });
    }
  }

  verReporte(proveedor: Proveedor): void {
    this.router.navigate(['/reportes'], { queryParams: { proveedorId: proveedor.id } });
  }
}