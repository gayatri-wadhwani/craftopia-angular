import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderStatusUpdateRequest {
  status: string;
}

export interface TransactionDetails {
  orderId: string;
  currency: string;
  key: string;
  amount: number;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: number;
}

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private paymentUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  placeOrder(): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/place`, {});
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/my`);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  createTransaction(amount: number): Observable<TransactionDetails> {
    return this.http.get<TransactionDetails>(`${this.paymentUrl}/${amount}`);
  }

  verifyPayment(request: PaymentVerificationRequest): Observable<string> {
    return this.http.post<string>(`${this.paymentUrl}/verify`, request);
  }

  // Razorpay payment integration
  initiatePayment(amount: number, orderId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.createTransaction(amount).subscribe({
        next: (transactionDetails) => {
          const options = {
            key: transactionDetails.key,
            amount: transactionDetails.amount,
            currency: transactionDetails.currency,
            order_id: transactionDetails.orderId,
            name: 'Craftopia',
            description: 'Payment for handmade products',
            handler: (response: any) => {
              // Verify payment
              const verificationRequest: PaymentVerificationRequest = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId
              };

              this.verifyPayment(verificationRequest).subscribe({
                next: (result) => {
                  resolve({ success: true, message: result });
                },
                error: (error) => {
                  reject({ success: false, message: 'Payment verification failed' });
                }
              });
            },
            prefill: {
              name: 'Customer',
              email: 'customer@example.com'
            },
            theme: {
              color: '#e74c3c'
            },
            modal: {
              ondismiss: () => {
                reject({ success: false, message: 'Payment cancelled' });
              }
            }
          };

          const rzp = new Razorpay(options);
          rzp.open();
        },
        error: (error) => {
          reject({ success: false, message: 'Failed to create payment order' });
        }
      });
    });
  }
}

