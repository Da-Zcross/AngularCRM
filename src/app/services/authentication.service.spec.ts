// Import des outils de test d'Angular
import { TestBed } from '@angular/core/testing';
// Import du service que nous allons tester
import { AuthenticationService } from './authentication.service';

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
    const testLogin = 'daz@gmail.com';
    const testPassword = 'password123';

    const result = service.authentUser(testLogin, testPassword);

    expect(result).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.login).toBe(testLogin);
    expect(result.lastname).toBe('Dassise');
    expect(result.firstname).toBe('Versace');
  });
});
