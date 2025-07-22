import { Component, OnInit } from '@angular/core';
import { ProductService, ProductResponse } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getSellerProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load your products. Please try again.';
        this.loading = false;
      }
    });
  }

  editProduct(productId: number): void {
    // Navigate to edit product page (to be implemented)
    this.router.navigate(['/edit-product', productId]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadMyProducts(); // Reload the list
        },
        error: (error) => {
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  addNewProduct(): void {
    this.router.navigate(['/add-product']);
  }
}

