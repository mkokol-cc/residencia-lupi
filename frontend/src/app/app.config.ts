import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './custom-services/in-memory-data.service';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { authInterceptor } from './interceptors/auth-token.interceptor';
import { provideEnvironmentNgxCurrency, NgxCurrencyInputMode } from 'ngx-currency';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideNativeDateAdapter(), // Proveedor esencial para que funcione el datepicker
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }, // Aquí seteas el formato (ej. Argentina)
    provideHttpClient(
      withInterceptors(
        [loaderInterceptor,authInterceptor/*,messageInterceptor,authInterceptor*/]
      )
    ),/*
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(
        InMemoryDataService, { 
          dataEncapsulation: false, 
          delay: 1000 
        }
      )
    ),*///api fake con 1 segundo de delay
    provideEnvironmentNgxCurrency({
      align: "left",
      allowNegative: false,
      allowZero: true,
      decimal: ",",
      precision: 2,
      prefix: "$ ",
      suffix: "",
      thousands: ".",
      nullable: true,
      min: 0,
      max: null,
      inputMode: NgxCurrencyInputMode.Financial,
    }),
  ]

};