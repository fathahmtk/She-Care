import React, { useState } from 'react';
// FIX: Import 'types.ts' to make the global JSX namespace augmentations available to this component.
import '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import QuestionIcon from '../components/icons/QuestionIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';

const PolicyInput: React.FC<{ label: string; name: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-2">{label}</label>
        <input
            type="url"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-surface border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-action-blue"
        />
    </div>
);


const AddPoliciesPage: React.FC = () => {
    const [policies, setPolicies] = useState({
        cancellation: '',
        contact: '',
        privacy: '',
        terms: '',
        shipping: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPolicies(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="dark bg-[#121212] min-h-screen text-text-primary font-body flex flex-col">
            <div className="flex-grow flex flex-col p-4 sm:p-6">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 w-full max-w-4xl mx-auto">
                    <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-surface">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <button className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-surface">
                        <span>Your Policies pages On Website</span>
                        <ChevronDownIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-surface">
                        <QuestionIcon className="w-6 h-6" />
                    </button>
                </header>

                {/* Form */}
                <main className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center">
                    <div className="mb-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center sm:text-left">Add Policy Page links</h1>
                        <p className="text-text-secondary mb-10 text-center sm:text-left">
                            We could not verify your policy pages{' '}
                            <a href="https://www.shecarehub.com" className="text-action-blue hover:underline">
                                https://www.shecarehub.com
                            </a>. Add these page links for verification.
                        </p>

                        <form className="space-y-5">
                            <PolicyInput label="Cancellation & Refund" name="cancellation" placeholder="Refund Policy Link" value={policies.cancellation} onChange={handleChange} />
                            <PolicyInput label="Contact us" name="contact" placeholder="Contact Us Policy Link" value={policies.contact} onChange={handleChange} />
                            <PolicyInput label="Privacy" name="privacy" placeholder="Privacy Policy Link" value={policies.privacy} onChange={handleChange} />
                            <PolicyInput label="Terms & Conditions" name="terms" placeholder="Terms & Condition Policy Link" value={policies.terms} onChange={handleChange} />
                            <PolicyInput label="Shipping" name="shipping" placeholder="Shipping Policy Link" value={policies.shipping} onChange={handleChange} />
                        </form>
                    </div>

                    {/* Footer Button */}
                    <footer className="w-full pt-8 mt-auto">
                        <button className="w-full bg-action-blue hover:bg-action-blue-hover text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            Continue
                        </button>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default AddPoliciesPage;