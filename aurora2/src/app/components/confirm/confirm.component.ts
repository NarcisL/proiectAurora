import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="p-mt-5 p-text-center">
      <h2>Email Confirmation</h2>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
})
export class ConfirmComponent implements OnInit {
  message = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    if (typeof window === 'undefined') {
    // Prevent SSR errors
    return;
  }
  const token = this.route.snapshot.queryParamMap.get('token');
  let confirmedToken = localStorage.getItem('confirmedToken');
  let confirmedMessage = localStorage.getItem('confirmedMessage');
  if (token && confirmedToken === token && confirmedMessage) {
    this.message = confirmedMessage;
    return;
  }
  if (token) {
    this.http
      .get('http://localhost:8080/api/auth/confirm?token=' + token, {
        responseType: 'text',
      })
      .subscribe({
        next: (msg) => {
          console.log('Success:', msg);
          this.message = msg;
          if (typeof window !== 'undefined') {
            localStorage.setItem('confirmedToken', token);
            localStorage.setItem('confirmedMessage', msg);
          }
        },
        error: (err) => {
          console.log('Error:', err);
          if (err.error && typeof err.error === 'string') {
            this.message = err.error;
          } else if (err.status === 0) {
            this.message = 'Could not connect to server.';
          } else {
            this.message = 'Invalid or expired token.';
          }
        },
      });
  } else {
    this.message = 'No token provided.';
  }
}
}
