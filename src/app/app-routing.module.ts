import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from './auth/auth.guard';
import { MyProductsComponent } from './products/my-products/my-products.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
  },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { 
    path: 'add-product', 
    component: AddProductComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'SELLER' } 
  },
  { 
    path: 'my-products', 
    component: MyProductsComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'SELLER' } 
  },
  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'BUYER' } 
  },
  { 
    path: 'orders', 
    component: OrdersComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'BUYER' } 
  },
  { 
    path: 'admin/orders', 
    component: OrdersComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'ADMIN' } 
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

