import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /**
   * Simule une requête API pour récupérer des utilisateurs
   */
  getUsers(): Observable<User[]> {
    return new Observable<User[]>((subscriber: Subscriber<User[]>) => {
      console.log('Début de la requête API simulée');

      // Simulation d'un délai réseau
      setTimeout(() => {
        try {
          // Données simulées
          const users: User[] = [
            { id: 1, login: 'john.doe', firstname: 'John', lastname: 'Doe' },
            { id: 2, login: 'jane.doe', firstname: 'Jane', lastname: 'Doe' },
          ];

          // Envoi des données aux abonnés
          subscriber.next(users);
          subscriber.complete();

        } catch (error) {
          // En cas d'erreur
          subscriber.error('Erreur lors de la récupération des utilisateurs');
        }
      }, 1000);

      // Nettoyage (optionnel)
      return () => {
        console.log('Nettoyage de l\'Observable');
      };
    });
  }
}
