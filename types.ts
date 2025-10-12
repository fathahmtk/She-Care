import type * as React from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
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