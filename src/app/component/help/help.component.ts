/**
 * Ce composant gère l'affichage des messages d'erreur pour les champs de formulaire.
 * Il est conçu pour être réutilisable dans toute l'application.
 */

import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";  // Pour la gestion des contrôles de formulaire
    // Pour les directives *ngIf et *ngFor

@Component({
  selector: "crm-help",      // Utilisé comme <crm-help> dans les templates
  standalone: true,          // Pas besoin de NgModule
  imports: [],   // Nécessaire pour *ngIf et *ngFor
  template: `
    <!-- Conteneur des messages d'erreur - visible uniquement si le champ a une erreur -->
    @if (isError()) {
      <span class="help-block">
        <!-- Affiche chaque message d'erreur dans une boucle -->
        @for (msg of errors; track msg) {
          <span>{{msg}}</span>
        }
      </span>
    }
    `,
  styles: [`
    /* Style pour les messages d'erreur */
    .help-block {
      color: #dc3545;         /* Rouge pour l'erreur */
      font-size: 0.875rem;    /* Taille réduite */
      margin-top: 0.25rem;    /* Espacement du champ */
      display: block;         /* En bloc pour bien séparer */
    }
  `]
})
export class HelpComponent {
  // Le contrôle de formulaire à surveiller (ex: input, password)
  @Input()
  field?: AbstractControl;

  // Les messages d'erreur personnalisés pour chaque type d'erreur
  // Ex: { required: 'Ce champ est obligatoire', email: 'Email invalide' }
  @Input()
  errorMessages?: { [key: string]: string };

  /**
   * Détermine si on doit afficher les messages d'erreur
   * @returns true si le champ a été touché et est invalide
   */
  isError(): boolean {
    return !!this.field &&           // Le champ existe
           this.field.touched &&     // L'utilisateur a interagi avec
           !this.field.valid;        // Le champ contient des erreurs
  }

  /**
   * Récupère les messages d'erreur à afficher
   * @returns tableau des messages d'erreur
   */
  get errors(): string[] {
    return Object.keys(this.field?.errors as object).map((key) => {
      // Utilise le message personnalisé ou un message par défaut
      return this.errorMessages?.[key]
        ? this.errorMessages?.[key]
        : `Missing message for ${key}`;
    });
  }
}
