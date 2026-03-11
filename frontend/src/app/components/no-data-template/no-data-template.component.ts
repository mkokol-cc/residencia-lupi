import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data-template',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './no-data-template.component.html',
  styleUrl: './no-data-template.component.scss'
})
export class NoDataTemplateComponent {
  @Input() message: string = 'No se encontraron resultados.'; 
}
