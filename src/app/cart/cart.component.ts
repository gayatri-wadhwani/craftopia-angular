import { Component, OnInit } from '@angular/core';
import { CartService, CartItemResponse } from './cart.service';
import { OrderService } from '../orders/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItemResponse[] = [];
  loading = false;
  error = '';
  totalAmount = 0;
  processingPayment = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.error = '';
    
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cart items. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.loadCartItems();
        alert('Item removed from cart');
      },
      error: (error) => {
        alert('Failed to remove item from cart');
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: (response) => {
          this.cartItems = [];
          this.totalAmount = 0;
          alert('Cart cleared successfully');
        },
        error: (error) => {
          alert('Failed to clear cart');
        }
      });
    }
  }

  async proceedToPayment(): Promise<void> {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.processingPayment = true;

    try {
      // First place the order
      const order = await this.orderService.placeOrder().toPromise();
      
      if (order) {
        // Then initiate Razorpay payment
        const paymentResult = await this.orderService.initiatePayment(this.totalAmount, order.id);
        
        if (paymentResult.success) {
          alert('Payment successful! Your order has been placed.');
          this.router.navigate(['/orders']);
        }
      }
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      this.processingPayment = false;
    }
  }

  // Alternative method for direct order placement without payment
  placeOrderDirectly(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.loading = true;
    this.orderService.placeOrder().subscribe({
      next: (order) => {
        this.loading = false;
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.loading = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }
}

