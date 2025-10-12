import React from 'react';
import type { Product, Testimonial, Review, FooterLink, SocialLink } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Menstrual Pain Relief Belt – Pink Edition",
    description: "shecare.co’s smart thermal pain-relief belt delivers soothing warmth and vibration therapy to ease menstrual cramps instantly. Designed in a soft pastel pink with adjustable comfort fit for all-day relief.",
    imageUrls: [
      "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7262402/pexels-photo-7262402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    modelUrl: undefined,
    price: 699,
    mrp: 1499,
    discount: "53%",
    inStock: true,
    tag: "New Arrival",
    color: "Pink",
    category: "Women Wellness",
    rating: 5,
    materials: "Premium soft-touch microfiber, medical-grade silicone",
    dimensions: "Adjustable strap fits waists 24-48 inches",
    careInstructions: "Wipe clean with a damp cloth. Do not submerge in water. Store in a cool, dry place.",
  },
  {
    id: 2,
    name: "Golden Elixir Serum",
    description: "A luxurious, lightweight serum infused with 24k gold flakes to hydrate, brighten, and firm the skin. Its potent blend of botanical extracts revitalizes your complexion for a youthful, radiant glow.",
    imageUrls: [
      "https://images.pexels.com/photos/5430631/pexels-photo-5430631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3997388/pexels-photo-3997388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7262899/pexels-photo-7262899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    modelUrl: undefined,
    price: 899,
    mrp: 1999,
    discount: "55%",
    inStock: true,
    tag: "Best Seller",
    color: "Gold",
    category: "Skincare",
    rating: 5,
  },
];


export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "shecare.co has transformed my skin. The Golden Elixir Serum feels like pure luxury and has given me a glow I haven't seen in years. Absolutely worth it!",
    author: "Eleanor Vance",
    rating: 5
  },
  {
    id: 2,
    quote: "I'm obsessed with the Midnight Bloom Face Oil. I wake up to plump, hydrated skin every morning. It's a non-negotiable part of my nightly routine now.",
    author: "Sofia Rossi",
    rating: 5
  },
  {
    id: 3,
    quote: "Finally, a cleanser that is both effective and gentle. The Velvet Cloud Cleanser is perfect for my sensitive skin. It feels so soft and luxurious.",
    author: "Chloe Dubois",
    rating: 5
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Olivia Martinez",
    productName: "Golden Elixir Serum",
    rating: 5,
    comment: "This serum is magic in a bottle. My skin has never felt so hydrated and luminous. The gold flakes feel incredibly luxurious. A must-have!"
  },
  {
    id: 2,
    author: "Amelia Chen",
    productName: "Velvet Cloud Cleanser",
    rating: 5,
    comment: "I have very sensitive skin, and this cleanser is a dream. It removes all my makeup without any irritation or dryness. It's so gentle and smells divine."
  },
  {
    id: 3,
    author: "Isabella Rodriguez",
    productName: "Midnight Bloom Face Oil",
    rating: 4,
    comment: "A truly nourishing oil. I wake up with softer skin, but it's a bit heavy for my combination skin type. I use it every other night and it works well."
  }
];


export const FOOTER_LINKS: { [key: string]: FooterLink[] } = {
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Philosophy", href: "#" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Shipping & Returns", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ]
};

// FIX: Replaced `React.FC` with explicit prop typing to match the `SocialLink` interface.
const SocialIconFacebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

// FIX: Replaced `React.FC` with explicit prop typing to match the `SocialLink` interface.
const SocialIconInstagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.535.012-4.774.069-2.694.123-3.999 1.428-4.122 4.122-.057 1.239-.069 1.603-.069 4.774s.012 3.535.069 4.774c.123 2.694 1.428 3.999 4.122 4.122 1.239.057 1.603.069 4.774.069s3.535-.012 4.774-.069c2.694-.123 3.999-1.428 4.122-4.122.057-1.239.069-1.603.069-4.774s-.012-3.535-.069-4.774c-.123-2.694-1.428-3.999-4.122-4.122C15.535 3.616 15.171 3.604 12 3.604zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.441a2.309 2.309 0 110 4.618 2.309 2.309 0 010-4.618zM16.949 6.27a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" />
  </svg>
);

// FIX: Replaced `React.FC` with explicit prop typing to match the `SocialLink` interface.
const SocialIconTwitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.333.57-.523 1.234-.523 1.947 0 1.615.823 3.043 2.072 3.878a4.65 4.65 0 01-2.11-.583v.06a4.66 4.66 0 003.733 4.568 4.69 4.69 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995c-.376 0-.747-.022-1.112-.065a13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.454 9.454 0 002.323-2.41z" />
  </svg>
);


export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "#", icon: SocialIconFacebook },
  { name: "Instagram", href: "#", icon: SocialIconInstagram },
  { name: "Twitter", href: "#", icon: SocialIconTwitter },
];