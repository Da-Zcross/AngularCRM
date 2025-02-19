import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { DataService } from '../services/data.service';
import { DemoObservableService } from '../common/demo-observable.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PhonePipe } from '../common/phone.pipe';

@Component({
  selector: 'crm-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatButtonModule, AsyncPipe, FormsModule, PhonePipe],
  template: `
    <div class="home-container">
      <!-- En-tête avec info utilisateur -->
      @if (currentUser) {
        <div class="user-header">
          <p>Connecté en tant que : {{ currentUser.firstname }} {{ currentUser.lastname }}</p>
          <button mat-raised-button color="warn" (click)="logout()">
            Déconnexion
          </button>
        </div>
      }

      <h1>Liste des utilisateurs</h1>

      <!-- Section de test Observable -->
      <div class="observable-test">
        <button mat-raised-button color="primary" (click)="onClick()">
          Test Observable
        </button>

        <!-- Affichage des résultats de l'Observable -->
        @if (observableResults.length > 0) {
          <div class="observable-results">
            <h3>Résultats de l'Observable :</h3>
            <ul>
              @for (result of observableResults; track result) {
                <li>Valeur reçue : {{ result }}</li>
              }
            </ul>
            @if (isCompleted) {
              <p class="completed">Observable terminé !</p>
            }
          </div>
        }
      </div>

      <!-- Test du pipe téléphone -->
      <div class="phone-test">
        <h3>Test du pipe téléphone</h3>
        <div class="phone-input">
          <label for="phone">Numéro de téléphone :</label>
          <input
            id="phone"
            type="text"
            [ngModel]="phone | phone"
            maxlength="14"
            (ngModelChange)="phone=$event"
            placeholder="Entrez un numéro"
          />
        </div>
        <p>Valeur brute : {{ phone }}</p>
        <p>Valeur formatée : {{ phone | phone }}</p>
      </div>

      <!-- Liste des utilisateurs avec pipe async -->
      @if (users$ | async; as users) {
        <ul class="users-list">
          @for (user of users; track user.id) {
            <li>
              <span class="user-info">
                {{ user.firstname }} {{ user.lastname }} ({{ user.login }})
              </span>
              <a [routerLink]="['/resources', user.id]" class="details-link">
                Voir les détails
              </a>
            </li>
          }
        </ul>
      } @else {
        <p>Chargement des utilisateurs...</p>
      }

      <div class="navigation">
        <a routerLink="/consumers" class="nav-link">Liste des clients</a>
        <a routerLink="/login" class="nav-link">Retour à la connexion</a>
      </div>
    </div>

    <style>
      .home-container {
        padding: 20px;
      }
      .user-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 20px;
      }
      .observable-value {
        margin: 20px 0;
        padding: 10px;
        background: #e3f2fd;
        border-radius: 4px;
        font-size: 16px;
      }
      .users-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
      }
      .users-list li {
        padding: 10px;
        margin: 5px 0;
        background: #f5f5f5;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .user-info {
        flex: 1;
      }
      .details-link {
        color: #3f51b5;
        text-decoration: none;
        margin-left: 15px;
      }
      .details-link:hover {
        text-decoration: underline;
      }
      .navigation {
        margin-top: 20px;
      }
      .nav-link {
        display: inline-block;
        padding: 8px 16px;
        color: #3f51b5;
        text-decoration: none;
        border: 1px solid #3f51b5;
        border-radius: 4px;
      }
      .nav-link:hover {
        background: #3f51b5;
        color: white;
      }
      button {
        margin: 10px 0;
      }
      .error {
        color: red;
        padding: 10px;
        margin: 10px 0;
        background: #ffebee;
        border-radius: 4px;
      }
      .observable-test {
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 4px;
      }
      .observable-results {
        margin-top: 15px;
        padding: 10px;
        background: #e3f2fd;
        border-radius: 4px;
      }
      .observable-results h3 {
        margin-top: 0;
        color: #1976d2;
      }
      .observable-results ul {
        list-style: none;
        padding: 0;
      }
      .observable-results li {
        padding: 5px 0;
        color: #2196f3;
      }
      .completed {
        color: #4caf50;
        font-weight: bold;
      }
      .phone-test {
        margin: 20px 0;
        padding: 15px;
        background: #f0f4f8;
        border-radius: 4px;
      }
      .phone-input {
        margin: 10px 0;
      }
      .phone-input label {
        display: block;
        margin-bottom: 5px;
        color: #333;
      }
      .phone-input input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        width: 200px;
      }
      .phone-input input:focus {
        outline: none;
        border-color: #2196f3;
        box-shadow: 0 0 0 2px rgba(33,150,243,0.2);
      }
    </style>
  `
})
export class HomeComponent implements OnDestroy {
  // Tableau pour stocker toutes les souscriptions
  private subs: Subscription[] = [];

  // Initialisation de users$ avec un Observable vide
  users$: Observable<User[]> = of([]);

  // Utilisateur actuellement connecté
  currentUser?: User;

  // Stockage des résultats de l'Observable
  observableResults: number[] = [];
  isCompleted = false;

  // Numéro de téléphone pour le test du pipe
  public phone = '0102030405';

  constructor(
    private dataService: DataService,
    private demoObs: DemoObservableService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Vérification de l'authentification
    if (!this.authService.authenticated) {
      console.log('Utilisateur non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }

    // Récupération de l'utilisateur connecté
    this.currentUser = this.authService.getCurrentUser();

    // Initialisation de l'observable des utilisateurs
    this.users$ = this.dataService.getUsers();
  }

  /**
   * Gestionnaire du clic sur le bouton de test
   * Ajoute une nouvelle souscription à l'Observable de démonstration
   */
  onClick(): void {
    // Réinitialisation des résultats
    this.observableResults = [];
    this.isCompleted = false;

    this.subs.push(
      this.demoObs.getObservable().subscribe({
        next: (result: number) => {
          console.log('Résultat reçu:', result);
          this.observableResults.push(result);
        },
        error: (error) => {
          console.error('Erreur dans l\'Observable:', error);
        },
        complete: () => {
          console.log('Observable terminé');
          this.isCompleted = true;
        }
      })
    );
  }

  /**
   * Gestion de la déconnexion
   */
  logout(): void {
    this.authService.disconnect();
    this.router.navigate(['/login']);
  }

  /**
   * Nettoyage des souscriptions à la destruction du composant
   * Évite les fuites mémoire
   */
  ngOnDestroy(): void {
    console.log('Nettoyage des souscriptions');
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
