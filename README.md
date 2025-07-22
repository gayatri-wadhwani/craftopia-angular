# Craftopia Frontend Application

A complete Angular frontend application for the Craftopia e-commerce platform, featuring handmade art and craft products.

## Features

### For All Users
- **Home Page**: Welcome page with information about Craftopia
- **Product Browsing**: View all products with search and category filtering
- **Product Details**: Detailed view of individual products
- **Authentication**: Login and registration with role-based access

### For Buyers
- **Shopping Cart**: Add products to cart with quantity management
- **Cart Management**: View, remove items, and clear cart
- **Payment Integration**: Razorpay payment gateway integration
- **Order Management**: View order history and status
- **Checkout Process**: Complete purchase flow with payment options

### For Sellers
- **Product Management**: Complete CRUD operations for products
- **Multiple Upload Methods**:
  - Single product upload with image
  - Bulk JSON upload for multiple products
  - CSV file upload for bulk products
  - AI-powered auto-fill for product details
- **My Products**: View and manage seller's product listings
- **Product Analytics**: Track product performance

### For Admins
- **Order Management**: View and update all orders
- **Status Updates**: Change order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

## Technical Stack

- **Framework**: Angular 16.2.11
- **Language**: TypeScript
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Angular HttpClient with interceptors
- **Authentication**: JWT-based with role-based guards
- **Payment**: Razorpay integration
- **Forms**: Reactive Forms with validation

## Prerequisites

- Node.js 20.0.0 or higher
- npm 9.6.4 or higher
- Angular CLI 16.2.11

## Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Update `src/environments/environment.ts` with your backend API URL
   - Default: `http://localhost:8080`

4. **Start development server**:
   ```bash
   ng serve
   ```

5. **Access the application**:
   - Open browser to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   │   ├── login/           # Login component
│   │   ├── register/        # Registration component
│   │   ├── auth.service.ts  # Authentication service
│   │   ├── auth.guard.ts    # Route guard
│   │   └── auth.interceptor.ts # HTTP interceptor
│   ├── products/            # Product management
│   │   ├── product-list/    # Product listing
│   │   ├── product-detail/  # Product details
│   │   ├── add-product/     # Product creation
│   │   ├── my-products/     # Seller's products
│   │   └── product.service.ts # Product service
│   ├── cart/                # Shopping cart
│   │   ├── cart.component.* # Cart management
│   │   └── cart.service.ts  # Cart service
│   ├── orders/              # Order management
│   │   ├── orders.component.* # Order listing
│   │   └── order.service.ts # Order service
│   ├── home/                # Home page
│   └── app-routing.module.ts # Route configuration
├── environments/            # Environment configs
└── styles.css              # Global styles
```

## API Integration

The frontend integrates with all backend endpoints:

### Authentication APIs
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Product APIs
- `GET /products` - Get all products with filters
- `GET /products/{id}` - Get product by ID
- `GET /products/my-products` - Get seller's products
- `POST /products` - Create single product with image
- `POST /products/bulk-json` - Bulk create from JSON
- `POST /products/bulk-csv` - Bulk create from CSV
- `POST /products/ai/auto-fill` - AI-powered product details
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Cart APIs
- `GET /cart` - Get cart items
- `GET /cart/count` - Get cart item count
- `POST /cart/add` - Add item to cart
- `DELETE /cart/remove/{productId}` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Order APIs
- `POST /orders/place` - Place new order
- `GET /orders/my` - Get buyer's orders
- `GET /orders/all` - Get all orders (admin)
- `PATCH /orders/{id}/status` - Update order status (admin)

### Payment APIs
- `GET /payment/{amount}` - Create Razorpay transaction
- `POST /payment/verify` - Verify payment signature

## Key Components

### Authentication Flow
1. Users register with role selection (BUYER/SELLER)
2. JWT tokens stored in localStorage
3. HTTP interceptor adds tokens to requests
4. Route guards protect role-specific pages

### Shopping Flow (Buyers)
1. Browse products with search/filter
2. View product details
3. Add items to cart
4. Proceed to checkout
5. Pay via Razorpay or place order directly
6. View order history

### Selling Flow (Sellers)
1. Access seller dashboard
2. Add products via multiple methods:
   - Single upload with image
   - Bulk JSON upload
   - CSV file upload
   - AI auto-fill assistance
3. Manage existing products
4. View product performance

### Payment Integration
- Razorpay checkout integration
- Secure payment verification
- Order status updates post-payment
- Fallback for direct order placement

## Environment Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

For production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com'
};
```

## Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Security Features

- JWT-based authentication
- Role-based access control
- HTTP interceptors for token management
- Route guards for protected pages
- Input validation and sanitization

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Deployment

1. Build the application:
   ```bash
   ng build --prod
   ```

2. Deploy the `dist/` folder to your web server

3. Configure your web server to serve `index.html` for all routes (for Angular routing)