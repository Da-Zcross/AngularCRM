import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

// Fonction de validation personnalisée pour le mot de passe
function checkPassword(c: AbstractControl): ValidationErrors | null {
  if (c.value.length < 5) {
    return {
      checkPassword: 'Error controle password'
    };
  }
  return null;
}

@Component({
  selector: 'crm-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  isBrowser: boolean;
  loginForm!: FormGroup;
  formMessage = {
    text: '',
    type: ''
  };

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5),
        checkPassword
      ]]
    });
  }

  // Getters pour accéder aux contrôles
  get loginControl() { return this.loginForm.get('login'); }
  get passwordControl() { return this.loginForm.get('password'); }

  isFormSubmittable(): boolean {
    if (!this.isBrowser) return false;

    const loginTouched = this.loginControl?.touched ?? false;
    const passwordTouched = this.passwordControl?.touched ?? false;

    return this.loginForm.valid &&
           !this.loginForm.pristine &&
           loginTouched &&
           passwordTouched;
  }

  onSubmit() {
    if (!this.isBrowser) return;

    // Marquer tous les champs comme touchés
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });

    if (this.loginForm.valid && this.isFormSubmittable()) {
      console.log('Formulaire valide, données:', this.loginForm.value);
      this.formMessage = {
        text: 'Connexion réussie !',
        type: 'success'
      };
    } else {
      let errors = [];

      if (this.loginControl?.errors) {
        if (this.loginControl.errors['required']) {
          errors.push("L'adresse email est requise");
        }
        if (this.loginControl.errors['email'] || this.loginControl.errors['pattern']) {
          errors.push("L'adresse email n'est pas valide");
        }
      }

      if (this.passwordControl?.errors) {
        if (this.passwordControl.errors['required']) {
          errors.push("Le mot de passe est requis");
        }
        if (this.passwordControl.errors['minlength'] || this.passwordControl.errors['checkPassword']) {
          errors.push("Le mot de passe doit contenir au moins 5 caractères");
        }
      }

      this.formMessage = {
        text: errors.join('\n'),
        type: 'error'
      };
    }
  }

  // Réinitialiser le message
  resetMessage() {
    this.formMessage = {
      text: '',
      type: ''
    };
  }
}
