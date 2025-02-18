import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = authService.isAuthenticated(); // On va créer cette méthode

  if (!isAuthenticated) {
    console.log('Accès refusé : utilisateur non authentifié');
    // Rediriger vers la page de login
    router.navigate(['/login']);
    return false;
  }

  return true;
};
