// FIX: Re-added `import React from "react"`. The previous removal of this import from this widely-used types file appears to have caused a global JSX type resolution failure, leading to widespread "Property 'div' does not exist" errors. Reinstating it ensures React's types are loaded correctly.
import React from "react";

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