import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { User } from '../models/user';
import { Consumer } from '../models/consumer';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Simule une requête API pour récupérer des utilisateurs
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users`);
  }

  /**
   * Récupère les clients depuis l'API
   * @param query Terme de recherche optionnel
   */
  getConsumers(page: number = 1, pageSize: number = 10, query: string = ''): Observable<PaginatedResponse<Consumer>> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    if (query) {
      params = params.set('q', query);
    }

    return this.http.get<Consumer[]>(`${this.apiUrl}/api/consumers`, {
      params,
      observe: 'response'
    }).pipe(
      map(response => {
        const total = Number(response.headers.get('X-Total-Count') || 0);
        return {
          items: response.body || [],
          total: total,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(total / pageSize)
        };
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error);
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur côté client:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Code d'erreur ${error.status}, ` +
        `Message: ${error.error}`);
    }

    return throwError(() => errorMessage);
  }

  /**
   * Ajoute un nouveau client
   */
  addConsumer(consumer: Omit<Consumer, 'id' | 'createdAt' | 'updatedAt'>): Observable<Consumer> {
    return this.http.post<Consumer>(`/api/consumers`, consumer);
  }

  /**
   * Met à jour un client existant
   */
  updateConsumer(id: number, consumer: Partial<Consumer>): Observable<Consumer> {
    return this.http.put<Consumer>(`/api/consumers/${id}`, consumer);
  }

  /**
   * Supprime un client
   */
  deleteConsumer(id: number): Observable<void> {
    return this.http.delete<void>(`/api/consumers/${id}`);
  }
}
