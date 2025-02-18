import { Injectable } from "@angular/core";

/**
 * Service d'authentification pour gérer l'authentification des utilisateurs
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor() {}

  /**
   * Authentifie un utilisateur avec son login et mot de passe
   * @param login Identifiant de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns Objet contenant les informations de l'utilisateur
   */
  authentUser(login: string, password: string): any {
    // TODO: À remplacer par une vraie logique d'authentification
    return {
      userId: 1,
      login: login,
      lastname: "Dassise",
      firstname: "Versace",
    };
  }
}
