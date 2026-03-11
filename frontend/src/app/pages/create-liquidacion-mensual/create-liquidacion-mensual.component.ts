import { Component } from '@angular/core';
import { LiquidacionMensualComponent } from '../liquidacion-mensual/liquidacion-mensual.component';

@Component({
  selector: 'app-create-liquidacion-mensual',
  standalone: true,
  imports: [
    LiquidacionMensualComponent
  ],
  templateUrl: './create-liquidacion-mensual.component.html',
  styleUrl: './create-liquidacion-mensual.component.scss'
})
export class CreateLiquidacionMensualComponent {
  residentes: any[] = [//Residente[]
    { dni: "1651651",apellido:"Gomez", nombre: 'Ilda' },
    { dni: "2151651",apellido:"Diaz", nombre: 'Ramon' },
    { dni: "1651651",apellido:"Gomez", nombre: 'Ilda' },
    { dni: "2151651",apellido:"Diaz", nombre: 'Ramon' },    { dni: "1651651",apellido:"Gomez", nombre: 'Ilda' },
    { dni: "2151651",apellido:"Diaz", nombre: 'Ramon' },    { dni: "1651651",apellido:"Gomez", nombre: 'Ilda' },
    { dni: "2151651",apellido:"Diaz", nombre: 'Ramon' },    { dni: "1651651",apellido:"Gomez", nombre: 'Ilda' },
    { dni: "2151651",apellido:"Diaz", nombre: 'Ramon' },
  ];
}
