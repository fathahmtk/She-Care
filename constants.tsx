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
  { name: "Facebook", href: "#", icon: SocialIconFacebook },
  { name: "Instagram", href: "#", icon: SocialIconInstagram },
  { name: "Twitter", href: "#", icon: SocialIconTwitter },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: "What is the Menstrual Pain Relief Belt?",
    answer: "Our Menstrual Pain Relief Belt is a smart, wearable device that uses a combination of heat and massage therapy to soothe menstrual cramps and discomfort. It's designed to be discreet, comfortable, and easy to use on the go.",
  },
  {
    question: "Is the heating belt safe to use?",
    answer: "Absolutely. The belt is made with skin-safe materials and features multiple temperature settings to ensure your comfort. It also has an automatic shut-off feature to prevent overheating. We recommend starting with the lowest heat setting and not using it for more than 30 minutes at a time directly on the skin.",
  },
  {
    question: "How do I care for my shecarehub.com products?",
    answer: "Care instructions vary by product. For our Relief Belt, we recommend wiping it clean with a damp cloth. For skincare items, please store them in a cool, dry place away from direct sunlight. Detailed instructions are provided with each product.",
  },
  {
    question: "How long does shipping take?",
    answer: "We offer free standard shipping across India. Orders are typically processed within 1-2 business days and delivered within 3-5 business days, depending on your location.",
  },
  {
    question: "What is your return policy?",
    answer: "We have a 7-day return policy for unused and unopened products in their original packaging. If you're not satisfied with your purchase, please contact our support team to initiate a return. You can find more details on our Shipping & Returns page.",
  },
];
