import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router'; // Importation du Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup; // Déclaration du formulaire
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router // Injection du Router
  ) { }

  ngOnInit(): void {
    this.initForm(); // Initialisation du formulaire lors de l'initialisation du composant
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/)
      ]]
    });
  }

  submit(): void {
    if (this.registerForm.valid) {
      // Appeler le service d'authentification pour l'inscription
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Inscription réussie !');
          // Redirection vers la page de connexion après inscription réussie
          this.router.navigate(['/connexion']);
        },
        (error) => {
          console.error('Erreur lors de l\'inscription :', error);
          // Gestion des erreurs d'inscription
        }
      );
    } else {
      console.log('Le formulaire n\'est pas valide.');
    }
  }

  // Fonction utilitaire pour accéder facilement aux contrôles de formulaire
  get formControls() {
    return this.registerForm.controls;
  }

  // Méthode pour rediriger vers la page de connexion manuellement
  goToLogin(): void {
    this.router.navigate(['/connexion']);
  }
}
