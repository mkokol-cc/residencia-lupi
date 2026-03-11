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
import { Router } from '@angular/router';

import { Concepto } from '../../model/concepto';
import { DialogConceptoComponent, DialogConceptoData } from '../../dialogs/dialog-concepto/dialog-concepto.component';
import { ConceptoService } from '../../custom-services/concepto.service';
import { NoDataTemplateComponent } from '../../components/no-data-template/no-data-template.component';

@Component({
  selector: 'app-crud-conceptos',
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
  templateUrl: './crud-conceptos.component.html'
})
export class CrudConceptosComponent implements OnInit {
  filterForm!: FormGroup;
  conceptos: Concepto[] = [];

  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private conceptoService: ConceptoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: ['']
    });

    this.cargarConceptos();
  }

  cargarConceptos(): void {
    const search = this.filterForm.get('search')?.value || '';
    this.conceptoService.searchConceptos(search, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.conceptos = data.content;
        this.totalElements = data.totalElements;
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.cargarConceptos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarConceptos();
  }

  abrirDialogo(concepto?: Concepto): void {
    // Cargamos todos los conceptos para el selector de padre en el diálogo
    this.conceptoService.getConceptos().subscribe(all => {
      const conceptosPadre = all.filter(c => c.id !== concepto?.id && !c.esDeIngreso);
      const dialogData: DialogConceptoData = { concepto, conceptosPadre };

      const dialogRef = this.dialog.open(DialogConceptoComponent, {
        width: '450px',
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.guardarConcepto(result);
        }
      });
    });
  }

  private guardarConcepto(concepto: Concepto): void {
    this.conceptoService.guardarConcepto(concepto).subscribe({
      next: () => {
        this.snackBar.open('Concepto guardado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarConceptos();
      },
      error: (err) => this.snackBar.open('Error al guardar el concepto', 'Cerrar', { duration: 3000 })
    });
  }

  eliminarConcepto(id: number): void {
    if (confirm('¿Estás seguro? Si este concepto es padre de otros, podrían quedar huérfanos.')) {
      this.conceptoService.eliminarConcepto(id).subscribe(() => {
        this.snackBar.open('Concepto eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.cargarConceptos();
      });
    }
  }

  verReporte(concepto: Concepto): void {
    this.router.navigate(['/reportes'], { queryParams: { conceptoId: concepto.id } });
  }
}