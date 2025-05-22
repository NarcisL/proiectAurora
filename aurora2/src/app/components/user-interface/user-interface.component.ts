import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

interface AuthResponse {
  token: string;
  username: string;
  id?: string;
  email?: string;
  roles?: string[];
}

interface UserUpdateRequest {
  email?: string;
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-user-interface',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './user-interface.component.html',
  styleUrl: './user-interface.component.css'
})
export class UserInterfaceComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginError: boolean = false;
  isLoggedIn: boolean = false;
  loggedInUsername: string = '';
  currentEmail: string = '';
  newEmail: string = ''; // For the new email input

  showUpdateEmailForm: boolean = false; // Flag to control visibility of the update form

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.loggedInUsername = localStorage.getItem('loggedInUsername') || 'User';
      this.currentEmail = localStorage.getItem('loggedInUserEmail') || 'Not set';
    } else {
      this.isLoggedIn = false;
      this.loggedInUsername = '';
      this.currentEmail = '';
    }
  }

  onLogin() {
    this.http.post<AuthResponse>('http://localhost:8080/api/auth/login', {
      username: this.username,
      password: this.password
    })
    .subscribe({
      next: (response) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('loggedInUsername', response.username);
          this.loggedInUsername = response.username;
          if (response.email) {
            localStorage.setItem('loggedInUserEmail', response.email);
            this.currentEmail = response.email;
          } else {
            localStorage.removeItem('loggedInUserEmail'); // Ensure it's cleared if not present
            this.currentEmail = 'Not set';
          }
          this.isLoggedIn = true;
          this.loginError = false;
          this.password = '';
          alert('Login successful!');
        } else {
          this.loginError = true;
          alert('Login failed: No token received.');
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginError = true;
        this.password = '';
        let errorMessage = 'Login failed! Check credentials.';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status === 401 && error.error && typeof error.error === 'string') {
            errorMessage = error.error;
        }
        alert(errorMessage);
      }
    });
  }

  onLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('loggedInUserEmail');
    this.isLoggedIn = false;
    this.loggedInUsername = '';
    this.currentEmail = '';
    this.newEmail = '';
    this.showUpdateEmailForm = false; // Hide form on logout
    this.username = '';
    this.password = '';
    alert('Logout successful!');
  }

  toggleUpdateForm(): void {
    this.showUpdateEmailForm = !this.showUpdateEmailForm;
    if (this.showUpdateEmailForm) {
      // Optionally pre-fill newEmail or clear it
      this.newEmail = ''; // Clear previous input when showing the form
    }
  }

  submitEmailUpdate(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Session expired. Please log in again.');
      this.checkLoginStatus(); // Updates isLoggedIn
      this.showUpdateEmailForm = false;
      return;
    }

    if (!this.newEmail || this.newEmail.trim() === '') {
      alert('Please enter a new email address.');
      return;
    }
    if (this.newEmail.trim().toLowerCase() === this.currentEmail.toLowerCase()) {
      alert('The new email is the same as your current email.');
      return;
    }

    const updatePayload: UserUpdateRequest = {
      email: this.newEmail.trim()
    };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<UserResponse>('http://localhost:8080/api/users/me', updatePayload, { headers })
      .subscribe({
        next: (response) => {
          alert('Email updated successfully!');
          if (response.email) {
            localStorage.setItem('loggedInUserEmail', response.email);
            this.currentEmail = response.email;
          }
          this.newEmail = '';
          this.showUpdateEmailForm = false; // Hide form on success
        },
        error: (error) => {
          console.error('Error updating email', error);
          let errorMessage = 'Failed to update email.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
            this.onLogout();
          } else if (error.status === 409) {
            errorMessage = error.error || 'Email already in use.';
          }
          alert(errorMessage);
        }
      });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Session expired. Please log in again.');
        this.checkLoginStatus();
        return;
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.delete('http://localhost:8080/api/users/me', { headers, responseType: 'text' })
        .subscribe({
          next: () => {
            alert('Account deleted successfully.');
            this.onLogout();
          },
          error: (error) => {
            console.error('Error deleting account', error);
            let errorMessage = 'Failed to delete account.';
            if (error.error && typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.status === 401) {
              errorMessage = 'Unauthorized. Please log in again.';
              this.onLogout();
            }
            alert(errorMessage);
          }
        });
    }
  }

  onDonate(): void { // Placeholder for Donate
    alert('Donate feature coming soon! Thank you for your support.');
  }

  onSupport(): void {
    alert('Support is on the way! If you need immediate assistance, please call 911.');
  }

  // Remove onDragonCoins if it's replaced by onDonate
  // onDragonCoins() {
  //   alert('Dragon Coins feature is not implemented yet.');
  // }
}