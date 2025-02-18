// Import des outils de test d'Angular
import { TestBed } from '@angular/core/testing';
// Import du service que nous allons tester
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';

// describe crée un groupe de tests pour le AuthenticationService
describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate user with credentials', () => {
    const testLogin = 'auth@gmail.com';
    const testPassword = 'password123';

    const result = service.authentUser(testLogin, testPassword);

    // Vérifier que le résultat n'est pas null
    expect(result).toBeTruthy();

    // Si le résultat n'est pas null, vérifier les propriétés
    if (result) {
      expect(result.id).toBe(1);
      expect(result.login).toBe(testLogin);
      expect(result.lastname).toBe('Jean');
      expect(result.firstname).toBe('Luc');
    }
  });

  it('should handle authentication state', () => {
    // Au départ, l'utilisateur n'est pas authentifié
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();

    // Après authentification
    const result = service.authentUser('test@test.com', 'password');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).toEqual(result);

    // Après déconnexion
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });
});
