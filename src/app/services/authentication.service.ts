import { Injectable } from "@angular/core";
import { User } from "../models/user";

const USER_STORAGE_KEY = "angular-crm.user";

/**
 * Service d'authentification pour gérer l'authentification des utilisateurs
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private currentUser?: User;

  constructor() {
    // Vérifier si un utilisateur est déjà connecté
    const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
    if (storedUser !== null) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  public get authenticated(): boolean {
    return !!this.currentUser;
  }

  /**
   * Authentifie un utilisateur avec son login et mot de passe
   * @param login Identifiant de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns Objet contenant les informations de l'utilisateur
   */
  authentUser(login: string, password: string): User {
    this.currentUser = {
      id: 1,
      login: login,
      lastname: "Doe",
      firstname: "John",
    };

    // Sauvegarder l'utilisateur dans la session
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  /**
   * Déconnecte l'utilisateur et nettoie la session
   */
  disconnect(): void {
    delete this.currentUser;
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  getCurrentUser(): User | undefined {
    return this.currentUser;
  }
}
