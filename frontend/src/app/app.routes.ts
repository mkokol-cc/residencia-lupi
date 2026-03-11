import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrudProveedoresComponent } from './pages/crud-proveedores/crud-proveedores.component';
import { CrudResidentesComponent } from './pages/crud-residentes/crud-residentes.component';
import { CrudPagosComponent } from './pages/crud-pagos/crud-pagos.component';
import { CrudMovimientosComponent } from './pages/crud-movimientos/crud-movimientos.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { CrudConceptosComponent } from './pages/crud-conceptos/crud-conceptos.component';
import { LiquidacionMensualComponent } from './pages/liquidacion-mensual/liquidacion-mensual.component';
import { authGuard } from './guards/auth.guard';
import { CajaComponent } from './pages/caja/caja.component';
import { CrudOperacionesComponent } from './pages/crud-operaciones/crud-operaciones.component';
import { CrudTipoOperacionComponent } from './pages/crud-tipo-operacion/crud-tipo-operacion.component';
import { ReportesOperacionesComponent } from './pages/reportes-operaciones/reportes-operaciones.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: DashboardComponent, canActivate: [authGuard], children: [
        { 
            path: 'liquidacion-mensual', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: LiquidacionMensualComponent 
        },{ 
            path: 'movimientos', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CrudMovimientosComponent 
        },{ 
            path: 'proveedores', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CrudProveedoresComponent 
        },{ 
            path: 'pagos', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CrudPagosComponent 
        },{ 
            path: 'conceptos', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CrudConceptosComponent 
        },{ 
            path: 'residentes', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CrudResidentesComponent 
        },{ 
            path: 'reportes', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: ReportesComponent 
        },{ 
            path: 'reportes-operaciones', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: ReportesOperacionesComponent 
        },{ 
            path: 'caja', 
            //redirectTo: 'feed', 
            pathMatch: 'full',
            component: CajaComponent 
        },
        {   path: 'operaciones', 
            pathMatch: 'full', 
            component: CrudOperacionesComponent 
        },
        {   path: 'tipo-operaciones', 
            pathMatch: 'full', 
            component: CrudTipoOperacionComponent 
        }],
    }
];
