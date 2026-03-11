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
import { Router, RouterModule } from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

import { Residente } from '../../model/residente';
import { DialogResidenteComponent } from '../../dialogs/dialog-residente/dialog-residente.component';
import { ResidenteService } from '../../custom-services/residente.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';

@Component({
  selector: 'app-crud-residentes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSnackBarModule,
    RouterModule,
    MatPaginatorModule,
    MatSelectModule,
    NoDataTemplateComponent
  ],
  templateUrl: './crud-residentes.component.html'
})
export class CrudResidentesComponent implements OnInit {
  filterForm!: FormGroup;
  residentes: Residente[] = [];

  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private residenteService: ResidenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      orden: ['apellido,asc']
    });

    this.cargarResidentes();
  }

  cargarResidentes(): void {
    const { search, orden } = this.filterForm.value;
    this.residenteService.searchResidentes(search, this.pageIndex, this.pageSize, orden)
      .subscribe(data => {
        this.residentes = data.content;
        this.totalElements = data.totalElements;
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.cargarResidentes();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarResidentes();
  }

  abrirDialogo(residente?: Residente): void {
    const dialogRef = this.dialog.open(DialogResidenteComponent, {
      width: '450px',
      data: residente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarResidente(result);
      }
    });
  }

  private guardarResidente(residente: Residente): void {
    this.residenteService.guardarResidente(residente).subscribe({
      next: () => {
        this.snackBar.open('Residente guardado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarResidentes();
      },
      error: (err) => this.snackBar.open('Error al guardar el residente', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarResidente(id: number|string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este residente?')) {
      this.residenteService.eliminarResidente(id).subscribe(() => {
        this.snackBar.open('Residente eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarResidentes();
      });
    }
  }

  public calcularEstadia(fechaIngresoStr: string): string {
    if (!fechaIngresoStr) {
        return 'Fecha no disponible';
    }

    const fechaIngreso = new Date(fechaIngresoStr);
    const hoy = new Date();

    if (isNaN(fechaIngreso.getTime()) || fechaIngreso > hoy) {
        return 'Fecha inválida';
    }

    let anios = hoy.getFullYear() - fechaIngreso.getFullYear();
    let meses = hoy.getMonth() - fechaIngreso.getMonth();
    let dias = hoy.getDate() - fechaIngreso.getDate();

    if (dias < 0) {
        meses--;
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
        anios--;
        meses += 12;
    }

    const totalMeses = anios * 12 + meses;

    const partes: string[] = [];
    if (totalMeses > 0) { partes.push(`${totalMeses} mes${totalMeses > 1 ? 'es' : ''}`); }
    if (dias > 0) { partes.push(`${dias} día${dias > 1 ? 's' : ''}`); }

    return partes.length > 0 ? partes.join(' y ') : 'Ingresó hoy';
  }

  verReporte(residente: Residente): void {
    this.router.navigate(['/reportes'], { queryParams: { residenteId: residente.id } });
  }
}