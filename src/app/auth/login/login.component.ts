import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      this.authService.login(this.loginForm.value).subscribe({
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
          this.error =
            error.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }
}
