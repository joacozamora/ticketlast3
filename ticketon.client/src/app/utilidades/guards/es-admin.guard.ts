import { CanActivateFn } from '@angular/router';

export const esAdminGuard: CanActivateFn = (route, state) => {
  return true;
};
