// By explicitly importing React, we ensure its types, including the base JSX.IntrinsicElements,
// are loaded before our augmentation. This prevents the augmentation from overwriting the global
// JSX types, which was causing errors for standard HTML tags like `<div>`, `<p>`, etc.
import React from 'react';

declare global {
  namespace JSX {
    // FIX: Removed the `extends React.JSX.IntrinsicElements` clause.
    // Standard TypeScript declaration merging will add our custom 'model-viewer'
    // element to the existing IntrinsicElements interface from React,
    // resolving the errors where standard HTML elements were not found.
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          // Use camelCase for custom element attributes to align with React's JSX prop conventions. React automatically converts camelCase props to kebab-case attributes for custom elements.
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
  // Using React.ReactNode directly now that the `react` module is imported at the top of the file.
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