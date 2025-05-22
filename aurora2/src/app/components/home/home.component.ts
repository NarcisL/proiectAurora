import { Component } from '@angular/core';
import { NewsComponent } from '../news/news.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}