import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  return router.parseUrl('/client');
};