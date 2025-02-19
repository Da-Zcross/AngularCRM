import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsumerService } from '../services/consumer.service';
import { Consumer } from '../models/consumer';
import { PaginatedResponse } from '../services/consumer.service';
import { lastValueFrom } from 'rxjs';

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
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <div class="consumer-list-container">
      <div class="header">
        <h1>Liste des Clients</h1>
        <div class="actions">
          <button
            mat-raised-button
            color="primary"
            (click)="createNewConsumer()"
          >
            <mat-icon>add</mat-icon>
            Nouveau Client
          </button>
          <button
            mat-raised-button
            color="warn"
            [disabled]="!selection.hasValue()"
            (click)="deleteSelected()"
          >
            <mat-icon>delete</mat-icon>
            Supprimer ({{selection.selected.length}})
          </button>
        </div>
      </div>

      <mat-form-field>
        <mat-label>Rechercher</mat-label>
        <input matInput (keyup)="onFilterChange($event)" placeholder="Ex. Jean" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
          <!-- Checkbox Column -->
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
              <mat-checkbox
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
              >
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)"
              >
              </mat-checkbox>
            </td>
          </ng-container>

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

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="editConsumer(element)"
                  matTooltip="Modifier"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteConsumer(element); $event.stopPropagation()"
                  matTooltip="Supprimer"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns;"
            (click)="selection.toggle(row)"
          ></tr>
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
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
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
    .mat-row:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .actions-cell {
      display: flex;
      gap: 8px;
    }
    .actions {
      display: flex;
      gap: 16px;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
    }
  `]
})
export class ConsumerListComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'civility',
    'firstname',
    'lastname',
    'email',
    'phone',
    'actions'
  ];
  dataSource: Consumer[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  selection = new SelectionModel<Consumer>(true, []);

  constructor(
    private consumerService: ConsumerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConsumers();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource);
  }

  async deleteSelected() {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer ${this.selection.selected.length} client(s) ?`);

    if (confirmDelete) {
      try {
        const selectedIds = this.selection.selected.map(consumer => consumer.id);

        // Suppression séquentielle des clients
        for (const id of selectedIds) {
          await lastValueFrom(this.consumerService.deleteConsumer(id));
        }

        // Rafraîchir la liste après la suppression
        this.selection.clear();
        this.loadConsumers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  loadConsumers(query: string = ''): void {
    this.consumerService.getConsumers(this.currentPage, this.pageSize, query)
      .subscribe({
        next: (response: PaginatedResponse<Consumer>) => {
          this.dataSource = response.items;
          this.totalItems = response.total;
          this.selection.clear();
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

  editConsumer(consumer: Consumer): void {
    this.router.navigate(['/consumers', consumer.id, 'edit']);
  }

  createNewConsumer(): void {
    this.router.navigate(['/consumers/new']);
  }

  async deleteConsumer(consumer: Consumer): Promise<void> {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer ${consumer.firstname} ${consumer.lastname} ?`);

    if (confirmDelete) {
      try {
        await lastValueFrom(this.consumerService.deleteConsumer(consumer.id));
        this.loadConsumers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }
}
