import React from 'react';
import type { Product } from '../types';
import AccordionItem from './AccordionItem';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const specifications = [
    { title: 'Color', value: product.color },
    { title: 'Dimensions', value: product.dimensions },
  ].filter(spec => spec.value);

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      {specifications.length > 0 && (
        <AccordionItem title="Product Specifications">
          <ul className="space-y-2 text-text-secondary">
            {specifications.map(spec => (
              <li key={spec.title} className="flex justify-between">
                <span className="font-semibold text-text-primary">{spec.title}:</span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {product.materials && (
        <AccordionItem title="Materials & Craft">
          <p className="text-text-secondary">{product.materials}</p>
        </AccordionItem>
      )}
      
      {product.careInstructions && (
         <AccordionItem title="Care Instructions">
          <p className="text-text-secondary">{product.careInstructions}</p>
        </AccordionItem>
      )}

      <AccordionItem title="Shipping & Returns">
        <p className="text-text-secondary">
          We offer free standard shipping across India on all orders. Typically, orders are delivered within 3-5 business days. We also have a 7-day return policy for unused and unopened products. For more details, please visit our policy page.
        </p>
      </AccordionItem>
    </div>
  );
};

export default ProductDetails;
