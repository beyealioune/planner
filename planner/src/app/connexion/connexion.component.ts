import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import { AuthService } from '../service/auth.service';
import { AuthSuccess } from '../models/authSuccess';
import { LoginRequest } from '../models/loginRequest';
import { User } from '../models/user';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit {

  loginForm!: FormGroup;
  onError: boolean = false; 

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
    console.log('Composant de connexion initialisé');
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
    console.log('Formulaire de connexion initialisé', this.loginForm);
  }

  onSubmit(): void {
    console.log('Soumission du formulaire de connexion', this.loginForm.value);

    const loginRequest = this.loginForm.value as LoginRequest;
    console.log('Données envoyées pour la connexion:', loginRequest);

    this.authService.login(loginRequest).subscribe(
      (response: AuthSuccess) => {
        console.log('Réponse de la connexion réussie:', response);
        localStorage.setItem('token', response.token);
        this.authService.me().subscribe((user: User) => {
          console.log('Utilisateur récupéré après connexion:', user);
          this.sessionService.logIn(user);
          this.router.navigate(['/navbar']);
        });
      },
      error => {
        console.error('Erreur lors de la connexion:', error);
        this.onError = true;
      }
    );
  }
}
