// FIX: Add React import to ensure the global JSX namespace from React's type
// definitions is available for augmentation, preventing it from being overwritten.
import React from 'react';

// Centralized JSX namespace augmentation for 'model-viewer'
// This ensures that the global JSX IntrinsicElements interface is extended
// without overwriting standard HTML element types like 'div' or 'p'.
// By placing it in this global types file, it's available application-wide.
declare global {
  namespace JSX {
    // FIX: Rely on declaration merging to extend IntrinsicElements.
    // The previous `extends React.JSX.IntrinsicElements` was causing the original
    // definitions to be overwritten, leading to errors for standard HTML tags.
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        cameraControls?: boolean;
        autoRotate?: boolean;
        shadowIntensity?: number;
      };
    }
  }
}

export interface Settings {
  logoUrl: string;
  heroImageUrl: string;
  heroAiPrompt: string;
  heroTagline: string;
  heroSubtitle: string;
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
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface BlogPost {
  id: number;
  category: string;
  title: string;
  snippet: string;
  imageUrl: string;
  href: string;
}