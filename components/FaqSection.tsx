import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import AccordionItem from './AccordionItem';
import { FAQ_DATA } from '../constants';

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">Frequently Asked Questions</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have questions? We have answers. Find the most common queries about our products and policies below.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={index} title={faq.question}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;