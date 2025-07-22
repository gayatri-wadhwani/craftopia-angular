import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, ProductRequest } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  productForm: FormGroup;
  loading = false;
  error = '';
  selectedFile: File | null = null;
  selectedCSVFile: File | null = null;
  bulkJsonData = '';
  uploadMethod: 'single' | 'bulk-json' | 'bulk-csv' = 'single';
  categories = [
    'Pottery',
    'Jewelry',
    'Textiles',
    'Woodwork',
    'Paintings',
    'Sculptures',
    'Other',
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: [''],
      tags: [''],
      style: [''],
      originalLanguageText: [''],
      translatedText: [''],
    });
  }

  setUploadMethod(method: 'single' | 'bulk-json' | 'bulk-csv'): void {
    this.uploadMethod = method;
    this.error = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onCSVFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCSVFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      this.loading = true;
      this.error = '';

      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category', this.productForm.get('category')?.value);

      const tags = this.productForm.get('tags')?.value;
      if (tags) {
        const tagArray = tags.split(',').map((tag: string) => tag.trim());
        tagArray.forEach((tag: string) => formData.append('tags', tag));
      }

      const style = this.productForm.get('style')?.value;
      if (style) formData.append('style', style);

      const originalText = this.productForm.get('originalLanguageText')?.value;
      if (originalText) formData.append('originalLanguageText', originalText);

      const translatedText = this.productForm.get('translatedText')?.value;
      if (translatedText) formData.append('translatedText', translatedText);

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          this.loading = false;
          alert('Product created successfully!');
          this.router.navigate(['/my-products']);
        },
        error: (error) => {
          this.loading = false;
          this.error =
            error.error?.message ||
            'Failed to create product. Please try again.';
        },
      });
    } else {
      this.error = 'Please fill all required fields and select an image.';
    }
  }

  uploadBulkJSON(): void {
    if (!this.bulkJsonData.trim()) {
      this.error = 'Please enter JSON data';
      return;
    }

    try {
      const products: ProductRequest[] = JSON.parse(this.bulkJsonData);
      this.loading = true;
      this.error = '';

      this.productService.bulkCreateProducts(products).subscribe({
        next: (response) => {
          this.loading = false;
          alert('Products uploaded successfully!');
          this.router.navigate(['/my-products']);
        },
        error: (error) => {
          this.loading = false;
          this.error =
            error.error?.message ||
            'Failed to upload products. Please check your JSON format.';
        },
      });
    } catch (e) {
      this.error = 'Invalid JSON format. Please check your data.';
    }
  }

  uploadCSV(): void {
    if (!this.selectedCSVFile) {
      this.error = 'Please select a CSV file';
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('file', this.selectedCSVFile);

    this.productService.bulkCreateFromCSV(formData).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Products uploaded successfully from CSV!');
        this.router.navigate(['/my-products']);
      },
      error: (error) => {
        this.loading = false;
        this.error =
          error.error?.message ||
          'Failed to upload CSV. Please check your file format.';
      },
    });
  }

  useAIAutoFill(): void {
    if (!this.selectedFile) {
      alert('Please select an image first');
      return;
    }

    const price = this.productForm.get('price')?.value;
    if (!price) {
      alert('Please enter a price first');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('price', price);

    const name = this.productForm.get('name')?.value;
    if (name) formData.append('name', name);

    const text = this.productForm.get('description')?.value;
    if (text) formData.append('description', text);

    this.productService.autoFillProduct(formData).subscribe({
      next: (response) => {
        this.loading = false;
        // // Fill the form with AI-generated data
        // this.productForm.patchValue({
        //   name: response.name,
        //   description: response.description,
        //   category: response.category,
        //   tags: response.tags?.join(', '),
        //   style: response.style,
        //   translatedText: response.translatedText,
        // });
        alert('Product details auto-filled and Product created successfully!');
        this.router.navigate(['/my-products']);
      },
      error: (error) => {
        this.loading = false;
        alert('AI auto-fill failed. Please fill manually.');
      },
    });
  }
}
