// FIX: Convert this file to a module by importing React types and exporting all declarations.
// This resolves issues where the file was not treated as a module, causing problems with
// global augmentations and making types unavailable for import in other files.
// Importing React brings its types into scope, fixing "Cannot find namespace 'React'" errors.
import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        // Use camelCase for custom element attributes to align with React's JSX prop conventions. React automatically converts camelCase props to kebab-case attributes for custom elements.
        cameraControls?: boolean;
        autoRotate?: boolean;
        shadowIntensity?: string;
      };
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
  productId: number;
  author: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface WhyChooseUsItem {
  // Using React.ReactNode which is globally available via @types/react
  icon: React.ReactNode;
  title: string;
  description: string; // This will be the AI-generated content
}

export interface BlogPost {
  id: number;
  category: string;
  title: string;
  snippet: string;
  imageUrl: string;
  href: string;
}