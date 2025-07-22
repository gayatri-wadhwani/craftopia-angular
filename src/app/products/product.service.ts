import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  tags?: string[];
  style?: string;
  originalLanguageText?: string;
  translatedText?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerEmail: string;
  tags?: string[];
  style?: string;
  originalLanguageText?: string;
  translatedText?: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Single product creation with image upload
  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, formData);
  }

  // Bulk product creation from JSON
  bulkCreateProducts(products: ProductRequest[]): Observable<ProductResponse[]> {
    return this.http.post<ProductResponse[]>(`${this.apiUrl}/bulk-json`, products);
  }

  // Bulk product creation from CSV
  bulkCreateFromCSV(formData: FormData): Observable<ProductResponse[]> {
    return this.http.post<ProductResponse[]>(`${this.apiUrl}/bulk-csv`, formData);
  }

  // AI auto-fill product details
  autoFillProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}/ai/auto-fill`, formData);
  }

  // Get all products with optional filters
  getAllProducts(category?: string, search?: string): Observable<ProductResponse[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    
    return this.http.get<ProductResponse[]>(this.apiUrl, { params });
  }

  // Get product by ID
  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  // Get seller's products
  getSellerProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/my-products`);
  }

  // Update product
  updateProduct(id: number, product: ProductUpdateRequest): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

