import React from 'react';
import { FOOTER_LINKS, SOCIAL_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/50 border-t border-border-color">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 mb-8 md:mb-0">
            <h2 className="text-2xl font-heading font-bold text-accent tracking-widest mb-4">SHE CARE</h2>
            <p className="text-text-secondary max-w-sm">
              Premium wellness and skincare dedicated to celebrating and nurturing the essence of womanhood.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-text-secondary hover:text-accent transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-text-secondary hover:text-accent transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-text-secondary hover:text-accent transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary/80 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SHE CARE. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {SOCIAL_LINKS.map(social => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-secondary hover:text-accent transition-colors"
              >
                <span className="sr-only">{social.name}</span>
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;