import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
export class ConsumerService {
  constructor(private http: HttpClient) {}

  getConsumers(page: number = 1, pageSize: number = 10, query: string = ''): Observable<PaginatedResponse<Consumer>> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    if (query) {
      params = params.set('q', query);
    }

    return this.http.get<Consumer[]>('/api/consumers', {
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

  getConsumerById(id: number): Observable<Consumer> {
    return this.http.get<Consumer>(`/api/consumers/${id}`);
  }

  searchConsumers(query: string): Observable<Consumer[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Consumer[]>(`/api/consumers`, { params });
  }

  addConsumer(consumer: Omit<Consumer, 'id'>): Observable<Consumer> {
    return this.http.post<Consumer>(`/api/consumers`, consumer);
  }

  updateConsumer(id: number, consumer: Partial<Consumer>): Observable<Consumer> {
    return this.http.put<Consumer>(`/api/consumers/${id}`, consumer);
  }

  deleteConsumer(id: number): Observable<void> {
    return this.http.delete<void>(`/api/consumers/${id}`);
  }

  createConsumer(consumer: Omit<Consumer, 'id'>): Observable<Consumer> {
    return this.http.post<Consumer>('/api/consumers', consumer);
  }
}
