import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerService } from '../services/consumer.service';
import { Consumer } from '../models/consumer';

@Component({
  selector: 'crm-consumer-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="edit-container">
      <h1>{{ isNew ? 'Nouveau Client' : 'Modifier le Client' }}</h1>

      <form [formGroup]="consumerForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Civilité</mat-label>
          <mat-select formControlName="civility">
            <mat-option value="M">Monsieur</mat-option>
            <mat-option value="Mme">Madame</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="firstname" placeholder="Prénom">
          <mat-error *ngIf="consumerForm.get('firstname')?.hasError('required')">
            Le prénom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="lastname" placeholder="Nom">
          <mat-error *ngIf="consumerForm.get('lastname')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="email@example.com">
          <mat-error *ngIf="consumerForm.get('email')?.hasError('required')">
            L'email est requis
          </mat-error>
          <mat-error *ngIf="consumerForm.get('email')?.hasError('email')">
            Format d'email invalide
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Téléphone</mat-label>
          <input matInput formControlName="phone" placeholder="0123456789">
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" (click)="onCancel()">
            Annuler
          </button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!consumerForm.valid || isSubmitting"
          >
            <mat-icon>{{ isNew ? 'add' : 'save' }}</mat-icon>
            {{ isNew ? 'Créer' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .edit-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class ConsumerEditComponent implements OnInit {
  consumerForm: FormGroup;
  isNew = true;
  consumerId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private consumerService: ConsumerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.consumerForm = this.fb.group({
      civility: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.consumerId = +id;
      this.loadConsumer(this.consumerId);
    }
  }

  onSubmit(): void {
    if (this.consumerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const consumerData = this.consumerForm.value;

      const operation = this.isNew
        ? this.consumerService.createConsumer(consumerData)
        : this.consumerService.updateConsumer(this.consumerId!, consumerData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Client ${this.isNew ? 'créé' : 'modifié'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/consumers']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.snackBar.open(
            `Erreur lors de ${this.isNew ? 'la création' : 'la modification'} du client`,
            'Fermer',
            { duration: 3000 }
          );
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/consumers']);
  }

  private loadConsumer(id: number): void {
    this.consumerService.getConsumerById(id).subscribe({
      next: (consumer: Consumer) => {
        this.consumerForm.patchValue(consumer);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client:', error);
        this.snackBar.open('Erreur lors du chargement du client', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/consumers']);
      }
    });
  }
}
