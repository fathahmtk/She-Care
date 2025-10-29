import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import WhatsAppIcon from './icons/WhatsAppIcon';

const PHONE_NUMBER = '911234567890'; // Placeholder Indian number
const MESSAGE = encodeURIComponent('Hello! I have a question about SheCareHub products.');

const WhatsAppLink: React.FC = () => {
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${MESSAGE}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:bg-[#128C7E]"
            aria-label="Chat with us on WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8"/>
        </a>
    );
};

export default WhatsAppLink;