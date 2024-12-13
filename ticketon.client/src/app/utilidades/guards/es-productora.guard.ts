import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { inject } from '@angular/core';

export const esProductoraGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const seguridadService = inject(SeguridadService);

  // Verificar si el usuario tiene el rol de productora
  const rol = seguridadService.obtenerRol();
  console.log('Rol del usuario:', rol); // Para depurar el rol del usuario

  if (rol === 'productora') {
    console.log('Acceso permitido: Usuario es productora');
    return true;
  }

  console.log('Acceso denegado: Redirigiendo al login');
  router.navigate(['/login']);
  return false;
};
