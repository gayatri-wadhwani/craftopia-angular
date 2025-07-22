import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['BUYER', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          const roles = this.authService.getUserRoles();
          
          // Redirect based on role
        if (roles.includes('SELLER') || roles.includes('ROLE_SELLER')) {
          this.router.navigate(['/products/my-products']);
        } else if (roles.includes('BUYER') || roles.includes('ROLE_BUYER')) {
          this.router.navigate(['/products']);
        } else if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/orders/all']);
        } else {
          this.router.navigate(['/home']);
        }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}

