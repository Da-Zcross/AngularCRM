import { Injectable } from "@angular/core";
import { User } from "../models/user";

/**
 * Service d'authentification pour gérer l'authentification des utilisateurs
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private authenticated = false;
  private currentUser: User | null = null;

  constructor() {}

  /**
   * Authentifie un utilisateur avec son login et mot de passe
   * @param login Identifiant de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns Objet contenant les informations de l'utilisateur
   */
  authentUser(login: string, password: string): User | null {
    // TODO: À remplacer par une vraie logique d'authentification
    const user: User = {
      id: 1,
      login: login,
      lastname: "Jean",
      firstname: "Luc",
    };

    // Stocker les informations de l'utilisateur
    this.authenticated = true;
    this.currentUser = user;
    return user;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns boolean indiquant si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authenticated = false;
    this.currentUser = null;
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns Informations de l'utilisateur ou null si non connecté
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
