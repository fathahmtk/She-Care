// FIX: By explicitly importing React, we ensure its types, including the base JSX.IntrinsicElements,
// are loaded before our augmentation. This prevents the augmentation from overwriting the global
// JSX types, which was causing errors for standard HTML tags like `<div>`, `<p>`, etc.
import * as React from 'react';

declare global {
  namespace JSX {
    // FIX: Extend React.JSX.IntrinsicElements to augment it instead of replacing it.
    // This ensures that standard HTML elements like 'div' are still available.
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          // FIX: Use camelCase for custom element attributes to align with React's JSX prop conventions. React automatically converts camelCase props to kebab-case attributes for custom elements.
          cameraControls?: boolean;
          autoRotate?: boolean;
          shadowIntensity?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export interface Shade {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description:string;
  imageUrls: string[];
  modelUrl?: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  mrp: number;
  discount: string;
  inStock: boolean;
  tag: string;
  color: string;
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
  shades?: Shade[];
}

export interface UserRating {
  productId: number;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
    id: string;
    orderDate: string;
    customer: ShippingInfo;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    payment: PaymentInfo;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  rating: number;
}

export interface Review {
  id: number;
  author: string;
  productName: string;
  rating: number;
  comment: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
}

export interface WhyChooseUsItem {
  // FIX: Using React.ReactNode directly now that the `react` module is imported at the top of the file.
  icon: React.ReactNode;
  title: string;
  description: string; // This will be the AI-generated content
}