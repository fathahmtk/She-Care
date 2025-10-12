// FIX: Switched from a namespace import to a default import for React. The namespace import was preventing TypeScript from correctly applying the global JSX type augmentations, which is necessary for recognizing custom elements like 'model-viewer'.
import React from 'react';

// FIX: Globally declare the 'model-viewer' custom element to ensure TypeScript recognizes it in JSX across the application.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
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

export interface Product {
  id: number;
  name: string;
  description:string;
  imageUrls: string[];
  modelUrl?: string;
  category: string;
  rating?: number;
  price: number;
  mrp: number;
  discount: string;
  inStock: boolean;
  tag: string;
  color: string;
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
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

export interface SocialLink {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
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