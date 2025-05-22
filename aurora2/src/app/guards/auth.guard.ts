import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
if(!authService.isLoggedIn()) {
  alert('You must be logged in to access this page.');
  router.navigate(['/']);
  return false;

}else {
  return true;}
}
