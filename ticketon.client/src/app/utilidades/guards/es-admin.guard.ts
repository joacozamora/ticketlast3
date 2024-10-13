import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { inject } from '@angular/core';

export const esAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const seguridadService = inject(SeguridadService);

  if (seguridadService.obtenerRol() === 'admin') {
    return true;
  }

  router.navigate(['/login']);
  return true;
};
