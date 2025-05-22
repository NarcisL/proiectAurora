import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (!control || !matchingControl) {
      return null;
    }
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

 onSubmit(): void {
    if (this.registerForm.valid) {
  
      const { confirmPassword, ...userDataToSend } = this.registerForm.value; 

      this.http.post('http://localhost:8080/api/users/register', userDataToSend)
        .subscribe({
          next: (response) => {
            console.log('User registered successfully', response);
            alert('Registration successful!');
          },
          error: (error) => {
            console.error('Error registering user', error);
            if (error.status === 409) {
              alert('Registration failed. This username or email is already be taken.');
            } else {
              alert('Registration failed. Please try again.');
            }
          }
        });
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
    }
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  hasLetter(value: string | null | undefined): boolean {
    if (!value) return false;
    return /[A-Za-z]/.test(value);
  }

  hasNumber(value: string | null | undefined): boolean {
    if (!value) return false;
    return /\d/.test(value);
  }
  
}