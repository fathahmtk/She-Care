import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartDisplay: React.FC = () => {
  const { cartItems } = useCart();

  return (
    <div className="bg-surface p-6 rounded-lg shadow-2xl border border-border-color w-80">
      <h3 className="text-xl font-heading text-text-primary mb-4 pb-2 border-b border-border-color">
        Shopping Cart
      </h3>
      {cartItems.length === 0 ? (
        <p className="text-text-secondary text-center py-4">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
          {cartItems.map((item, index) => (
            // Using index in the key to handle cases where the same product is added multiple times
            <li key={`${item.id}-${index}`} className="flex justify-between items-center text-sm">
              <span className="text-text-primary flex-1 pr-4">{item.name}</span>
              <span className="font-semibold text-accent">₹{item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartDisplay;
