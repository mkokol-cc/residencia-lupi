import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoaderService)
  loadingService.showLoading()
  return next(req).pipe(
    finalize(async () => {
      loadingService.hideLoading()
    })
  );
};
