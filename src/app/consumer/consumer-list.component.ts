import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ConsumerService } from '../services/consumer.service';
import { Consumer } from '../models/consumer';
import { PaginatedResponse } from '../services/consumer.service';

@Component({
  selector: 'crm-consumer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="consumer-list-container">
      <h1>Liste des Clients</h1>

      <mat-form-field>
        <mat-label>Rechercher</mat-label>
        <input matInput (keyup)="onFilterChange($event)" placeholder="Ex. Jean" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
          <ng-container matColumnDef="civility">
            <th mat-header-cell *matHeaderCellDef>Civilité</th>
            <td mat-cell *matCellDef="let element">{{element.civility}}</td>
          </ng-container>

          <ng-container matColumnDef="firstname">
            <th mat-header-cell *matHeaderCellDef>Prénom</th>
            <td mat-cell *matCellDef="let element">{{element.firstname}}</td>
          </ng-container>

          <ng-container matColumnDef="lastname">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let element">{{element.lastname}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{element.email}}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Téléphone</th>
            <td mat-cell *matCellDef="let element">{{element.phone}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPageChange($event)"
          showFirstLastButtons
          aria-label="Sélectionner une page">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .consumer-list-container {
      padding: 20px;
    }
    .table-container {
      margin-top: 20px;
      overflow: auto;
    }
    table {
      width: 100%;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
  `]
})
export class ConsumerListComponent implements OnInit {
  displayedColumns: string[] = ['civility', 'firstname', 'lastname', 'email', 'phone'];
  dataSource: Consumer[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  constructor(private consumerService: ConsumerService) {}

  ngOnInit(): void {
    this.loadConsumers();
  }

  loadConsumers(query: string = ''): void {
    this.consumerService.getConsumers(this.currentPage, this.pageSize, query)
      .subscribe({
        next: (response: PaginatedResponse<Consumer>) => {
          this.dataSource = response.items;
          this.totalItems = response.total;
        },
        error: (error: Error) => {
          console.error('Erreur lors du chargement des clients:', error);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadConsumers();
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 2) {
      this.currentPage = 1;
      this.loadConsumers(filterValue.trim().toLowerCase());
    } else if (filterValue.length === 0) {
      this.loadConsumers();
    }
  }
}
