import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, ProductResponse } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponse | null = null;
  loading = false;
  error = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Product not found or failed to load.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      alert('Please login to add items to cart');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.authService.hasRole('BUYER')) {
      alert('Only buyers can add items to cart');
      return;
    }

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: (response) => {
        alert('Product added to cart successfully!');
      },
      error: (error) => {
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }

  canAddToCart(): boolean {
    return this.authService.isAuthenticated() && this.authService.hasRole('BUYER');
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

