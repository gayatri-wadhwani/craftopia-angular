import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  getCartItems(): Observable<CartItemResponse[]> {
    return this.http.get<CartItemResponse[]>(this.apiUrl);
  }

  getCartItemCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`)
      .pipe(
        tap(count => this.cartCountSubject.next(count))
      );
  }

  addToCart(request: AddToCartRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add`, request)
      .pipe(
        tap(() => this.loadCartCount())
      );
  }

  removeFromCart(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/remove/${productId}`)
      .pipe(
        tap(() => this.loadCartCount())
      );
  }

  clearCart(): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/clear`)
      .pipe(
        tap(() => this.cartCountSubject.next(0))
      );
  }

  private loadCartCount(): void {
    this.getCartItemCount().subscribe();
  }
}

