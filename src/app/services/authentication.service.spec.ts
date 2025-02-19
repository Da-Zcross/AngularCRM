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

    // Nettoyer le sessionStorage avant chaque test
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate user with credentials', () => {
    const testLogin = 'auth@gmail.com';
    const testPassword = 'password123';

    const result = service.authentUser(testLogin, testPassword);

    expect(result).toBeTruthy();
    if (result) {
      expect(result.id).toBe(1);
      expect(result.login).toBe(testLogin);
      expect(result.lastname).toBe('Doe');
      expect(result.firstname).toBe('John');
    }
  });

  it('should handle authentication state', () => {
    // Au départ, l'utilisateur n'est pas authentifié
    expect(service.authenticated).toBeFalse();
    expect(service.getCurrentUser()).toBeUndefined();

    // Après authentification
    const result = service.authentUser('test@test.com', 'password');
    expect(service.authenticated).toBeTrue();
    expect(service.getCurrentUser()).toEqual(result);

    // Après déconnexion
    service.disconnect();
    expect(service.authenticated).toBeFalse();
    expect(service.getCurrentUser()).toBeUndefined();
  });

  it('should persist user in session storage', () => {
    const testUser = service.authentUser('test@test.com', 'password');

    // Vérifier que l'utilisateur est stocké dans la session
    const storedUser = sessionStorage.getItem('angular-crm.user');
    expect(storedUser).toBeTruthy();
    expect(JSON.parse(storedUser!)).toEqual(testUser);
  });

  it('should clear session on disconnect', () => {
    // D'abord connecter un utilisateur
    service.authentUser('test@test.com', 'password');

    // Puis le déconnecter
    service.disconnect();

    // Vérifier que la session est vide
    expect(sessionStorage.getItem('angular-crm.user')).toBeNull();
    expect(service.authenticated).toBeFalse();
  });
});
