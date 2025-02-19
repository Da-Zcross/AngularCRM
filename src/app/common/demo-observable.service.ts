import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoObservableService {
  getObservable(): Observable<number> {
    return new Observable<number>((subscriber: Subscriber<number>) => {
      console.log('Observable créé');

      // Envoi des résultats séquentiels
      setTimeout(() => {
        console.log('Émission de 1');
        subscriber.next(1);
      }, 1000);

      setTimeout(() => {
        console.log('Émission de 2');
        subscriber.next(2);
      }, 2000);

      setTimeout(() => {
        console.log('Émission de 3');
        subscriber.next(3);
      }, 3000);

      // Fin du traitement
      setTimeout(() => {
        console.log('Complétion de l\'Observable');
        subscriber.complete();
      }, 4000);

      // Fonction de nettoyage
      return () => {
        console.log('Nettoyage de l\'Observable');
      };
    });
  }
}
