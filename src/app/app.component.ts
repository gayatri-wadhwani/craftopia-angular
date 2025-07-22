// MODULES //
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES //
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'craftopia';

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Is Authenticated:', this.authService.isAuthenticated());
    console.log('Is Buyer:', this.authService.hasRole('BUYER'));
    console.log('Is Seller:', this.authService.hasRole('SELLER'));
    console.log('Is Admin:', this.authService.hasRole('ADMIN'));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
