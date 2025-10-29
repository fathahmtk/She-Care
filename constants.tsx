import React from 'react';
import type { FooterLink } from './types';
import SocialIconFacebook from './components/icons/SocialIconFacebook';
import SocialIconInstagram from './components/icons/SocialIconInstagram';
import SocialIconTwitter from './components/icons/SocialIconTwitter';

export const FOOTER_LINKS: { [key: string]: FooterLink[] } = {
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Philosophy", href: "#" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#faq" },
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
  { name: "Facebook", href: "https://facebook.com", icon: SocialIconFacebook },
  { name: "Instagram", href: "https://instagram.com", icon: SocialIconInstagram },
  { name: "Twitter", href: "https://twitter.com", icon: SocialIconTwitter },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: "How do I find the right size?",
    answer: "Each product page includes a detailed size guide with measurements. We recommend comparing these with your own measurements to find the perfect fit. If you're between sizes, we suggest sizing up for a more comfortable fit.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day return policy for unworn items with tags still attached. Please visit our Shipping & Returns page for detailed instructions on how to initiate a return or exchange.",
  },
  {
    question: "What materials are your products made from?",
    answer: "We are committed to quality and use a range of premium materials, from organic cottons and silks to genuine leather. Specific material information is available in the 'Details' section on each product page.",
  },
  {
    question: "How long does shipping take?",
    answer: "We offer free standard shipping across India. Orders are typically processed within 1-2 business days and delivered within 3-5 business days, depending on your location.",
  },
  {
    question: "How should I care for my garments?",
    answer: "To ensure longevity, we recommend following the care instructions on the garment's label. For most of our delicate items, we suggest gentle hand washing or dry cleaning.",
  },
];