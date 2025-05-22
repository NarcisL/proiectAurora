import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { TitleComponent } from './components/title/title.component';
import { UserInterfaceComponent } from "./components/user-interface/user-interface.component";
import { CommonModule } from '@angular/common';
import { CalendarEvenimenteComponent } from './components/calendar-evenimente/calendar-evenimente.component';
import { SocialLinksComponent } from "./components/social-links/social-links.component";
import { SharedUiModule } from './shared-ui.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,SharedUiModule ,
     TitleComponent, CommonModule, CalendarEvenimenteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title= 'Aurora2';
}