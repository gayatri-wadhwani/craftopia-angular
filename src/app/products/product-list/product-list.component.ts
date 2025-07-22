// MODULES //
import { Component, OnInit } from '@angular/core';

// SERVICES //
import { ProductService, ProductResponse } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  categories: string[] = [
    'All',
    'Pottery',
    'Jewelry',
    'Textiles',
    'Woodwork',
    'Paintings',
    'Sculptures',
    'Other',
  ];
  selectedCategory = 'All';
  searchTerm = '';
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });
  }

  filterProducts(): void {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  addToCart(product: ProductResponse): void {
    if (!this.authService.isAuthenticated()) {
      alert('Please login to add items to cart');
      return;
    }

    if (!this.authService.hasRole('BUYER')) {
      alert('Only buyers can add items to cart');
      return;
    }

    this.cartService
      .addToCart({
        productId: product.id,
        quantity: 1,
      })
      .subscribe({
        next: (response) => {
          alert('Product added to cart successfully!');
        },
        error: (error) => {
          alert('Failed to add product to cart. Please try again.');
        },
      });
  }

  canAddToCart(): boolean {
    return (
      this.authService.isAuthenticated() && this.authService.hasRole('BUYER')
    );
  }
}
