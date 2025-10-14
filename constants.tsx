
import React from 'react';
import type { Product, Testimonial, Review, FooterLink } from './types';
import SocialIconFacebook from './components/icons/SocialIconFacebook';
import SocialIconInstagram from './components/icons/SocialIconInstagram';
import SocialIconTwitter from './components/icons/SocialIconTwitter';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Menstrual Pain Relief Belt – Pink Edition",
    brand: "SheCareHub",
    description: "shecarehub.com’s smart thermal pain-relief belt delivers soothing warmth and vibration therapy to ease menstrual cramps instantly. Designed in a soft pastel pink with adjustable comfort fit for all-day relief.",
    imageUrls: [
      "https://m.media-amazon.com/images/I/71YqDc-POJL.jpg",
      "https://m.media-amazon.com/images/I/71yD2O6p7JL.jpg",
      "https://m.media-amazon.com/images/I/71wE7-p-nRL.jpg",
      "https://m.media-amazon.com/images/I/71b2-rJ+j+L.jpg",
      "https://m.media-amazon.com/images/I/71JgXb7pYKL.jpg",
      "https://m.media-amazon.com/images/I/61Nl-N-xSjL.jpg",
      "https://worldbeautycare.in/cdn/shop/files/3_140f7d24-320c-43f1-b957-e685f02c6114.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/4_61159816-7788-46d5-91f8-086782a2dae7.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/5_ff1acb6c-8438-4e89-af0a-85d18d4ed04e.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/7_70d10b78-b3d9-482f-871d-531e2898c56c.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/2_ef9e1a12-658b-4963-8a9d-cae979a784d1.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/6_714d3b84-6997-4007-bd8b-70337c7edde0.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/8_86a11756-319c-43f1-b960-934c9f131a19.jpg?v=1711690947",
      "https://worldbeautycare.in/cdn/shop/files/9_c931448b-e85d-4f1b-a579-24250106208a.jpg?v=1711690947"
    ],
    modelUrl: undefined,
    price: 699,
    mrp: 1499,
    discount: "53%",
    inStock: true,
    tag: "New Arrival",
    color: "Pink",
    category: "Women Wellness",
    rating: 4.8,
    reviewCount: 152,
    materials: "Premium soft-touch microfiber, medical-grade silicone",
    dimensions: "Adjustable strap fits waists 24-48 inches",
    careInstructions: "Wipe clean with a damp cloth. Do not submerge in water. Store in a cool, dry place.",
  },
  {
    id: 2,
    name: "Golden Elixir Serum",
    brand: "Elysian Glow",
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
    rating: 4.9,
    reviewCount: 98,
  },
  {
    id: 3,
    name: "Ayurvedic Radiance Lipstick",
    brand: "AyurHue",
    description: "Indulge in the richness of nature with our Ayurvedic Radiance Lipstick. Infused with Ghee and Almond Oil, this lipstick collection offers vibrant color while deeply moisturizing your lips. Available in shades inspired by the beauty of India.",
    imageUrls: [
      "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1377034/pexels-photo-1377034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2080548/pexels-photo-2080548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    shades: [
      { name: "Lotus Pink", hex: "#E58A9E" },
      { name: "Terracotta Nude", hex: "#C87A6A" },
      { name: "Ruby Red", hex: "#A4293A" },
      { name: "Mahogany Brown", hex: "#6F3E37" },
      { name: "Coral Sunset", hex: "#E96D59" },
    ],
    price: 750,
    mrp: 999,
    discount: "25%",
    inStock: true,
    tag: "New Arrival",
    color: "Multiple",
    category: "Skincare",
    rating: 4.5,
    reviewCount: 76,
  }
];


export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "shecarehub.com has transformed my skin. The Golden Elixir Serum feels like pure luxury and has given me a glow I haven't seen in years. Absolutely worth it!",
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

export interface SocialLink {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "#", icon: SocialIconFacebook },
  { name: "Instagram", href: "#", icon: SocialIconInstagram },
  { name: "Twitter", href: "#", icon: SocialIconTwitter },
];