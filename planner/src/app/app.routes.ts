import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PlanningComponent } from './planning/planning.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { RegisterComponent } from './register/register.component';
import { ProfilComponent } from './profil/profil.component';

export const routes: Routes = [
    {
      path: 'navbar',component: NavbarComponent,
    },
    {
      path: 'profile',component: ProfilComponent
    },
    {
        path: 'home',component: HomeComponent,
      },{
        path: 'planning',component: PlanningComponent,
      },
      {
        path: 'calendar',component: CalendarComponent,
      },
      {
        path: 'connexion',component: ConnexionComponent,
      },
      {
        path: 'register',component: RegisterComponent,
      },
      {
        path: '',component: RegisterComponent,
      }
  ];