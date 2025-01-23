import { Component } from '@angular/core';
import { PlanningComponent } from "../planning/planning.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PlanningComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
