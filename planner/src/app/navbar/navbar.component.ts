import { Component, OnInit } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { AvailabilityServiceService } from "../service/availability-service.service";
import { UserService } from "../service/user.service";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PlanningComponent } from "../planning/planning.component";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from '@angular/material/expansion'; // ✅ Ajouté
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PlanningComponent,
    MatListModule,
    MatExpansionModule, 
    MatToolbarModule// ✅ requis pour <mat-expansion-panel>
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  currentUser!: any;
  allUsers: any[] = [];
  commonAvailabilities: any[] = [];
  selectedUserId: number | null = null;
  subscriptionsAvailability: { userId: number, username: string, availabilities: any[] }[] = [];
  showSubscriptions = false;
  isMenuOpen: boolean = false;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private availabilityService: AvailabilityServiceService
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe(user => {
      this.currentUser = user;
      this.loadAllUsers();
    });
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users.filter(u => u.id !== this.currentUser.id);
    });
  }

  isSubscribed(user: any): boolean {
    return this.currentUser.subscribers?.includes(user.id) ?? false;
  }

  toggleSubscription(user: any): void {
    const subscribed = this.isSubscribed(user);
  
    const action = subscribed
      ? this.userService.unsubscribe(user.id, this.currentUser.id)
      : this.userService.subscribe(user.id, this.currentUser.id);
  
    action.subscribe(() => {
      if (subscribed) {
        this.currentUser.subscribers = this.currentUser.subscribers.filter((id: any) => id !== user.id);
        this.commonAvailabilities = [];
      } else {
        this.currentUser.subscribers.push(user.id);
        this.loadCommonAvailabilities(user.id);
      }
    });
  }
  

  loadCommonAvailabilities(userId: number): void {
    this.selectedUserId = userId;
    this.availabilityService
      .getCommonAvailabilities(this.currentUser.id, userId)
      .subscribe(availabilities => {
        this.commonAvailabilities = availabilities;
      });
  }

  loadAllCommonAvailabilities(): void {
    console.log("bouton");
    this.showSubscriptions = !this.showSubscriptions;

    this.subscriptionsAvailability = [];
  
    this.currentUser.subscribers.forEach((userId: number) => {
      const user = this.allUsers.find(u => u.id === userId);
      if (!user) return;
  
      this.availabilityService.getCommonAvailabilities(this.currentUser.id, userId)
        .subscribe(availabilities => {
          this.subscriptionsAvailability.push({
            userId,
            username: user.username,
            availabilities
          });
        });
    });
  }
  

  getUserPhotoUrl(userId: number): string {
    return `http://localhost:8080/assets/profiles/${userId}.jpg`;
  }
  
  onImgError(event: any) {
    event.target.src = '/assets/default-profile.jpg';
  }

  handleImgError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/default.jpg';
  }
  
  
}
