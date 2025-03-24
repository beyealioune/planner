import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { ProfilService } from '../service/profil.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  newPassword: string = '';

  constructor(private http: HttpClient,    private authService: AuthService,    private profilService: ProfilService,
  
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((data) => {
      this.user = data;
    });
  }

 onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto(): void {
    if (!this.selectedFile) return;
    this.profilService.uploadPhoto(this.user.id, this.selectedFile)
      .subscribe(() => alert('Photo mise à jour !'));
  }

  updateProfile(): void {
    this.profilService.updateProfile(this.user)
      .subscribe(() => alert('Profil mis à jour !'));
  }

  updatePassword(): void {
    this.profilService.updatePassword(this.newPassword)
      .subscribe(() => alert('Mot de passe changé !'));
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/default-profile.jpg';
  }
}
