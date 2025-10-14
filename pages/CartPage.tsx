import React from 'react';
import { useCart } from '../contexts/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import CloseIcon from '../components/icons/CloseIcon';
import EmptyCartAnimation from '../components/icons/EmptyCartAnimation';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <AnimatedSection>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-heading text-accent mb-8 text-center">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg shadow-md flex flex-col items-center justify-center">
            <EmptyCartAnimation className="w-32 h-32 text-border-color" />
            <p className="text-xl font-semibold text-text-primary mt-6">Your shopping bag is empty</p>
            <p className="text-text-secondary mt-2 mb-8">Looks like you haven't added anything yet.</p>
            <a href="#" className="bg-accent text-background-start font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out transform hover:scale-105">
              Explore Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center border-b border-border-color pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</h2>
                  <button onClick={clearCart} className="text-sm text-text-secondary hover:text-red-500 transition-colors">Clear Cart</button>
              </div>

              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 border-b border-border-color pb-6">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-24 object-cover rounded-md"/>
                      <div>
                        <a href={`#/product/${item.id}`} className="font-semibold text-text-primary hover:text-accent transition-colors">{item.name}</a>
                        <p className="text-text-secondary text-sm mt-1">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border-color rounded-md">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="px-3 py-2 text-md font-bold hover:bg-accent/10 transition-colors rounded-l-md">-</button>
                        <input type="text" readOnly value={item.quantity} className="w-12 text-center font-semibold text-md bg-transparent border-x border-border-color py-2 focus:outline-none" />
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="px-3 py-2 text-md font-bold hover:bg-accent/10 transition-colors rounded-r-md">+</button>
                      </div>
                      <p className="font-semibold text-lg text-text-primary w-24 text-right">₹{item.price * item.quantity}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-text-secondary hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-500/10" aria-label={`Remove ${item.name}`}>
                        <CloseIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface p-6 rounded-lg shadow-md sticky top-32">
                <h2 className="text-2xl font-heading text-text-primary border-b border-border-color pb-4 mb-4">Order Summary</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold text-text-primary">₹{cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center mb-6">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="font-semibold text-text-primary">FREE</span>
                </div>
                <div className="flex justify-between items-center border-t border-border-color pt-4 mb-6">
                  <span className="text-xl font-bold text-text-primary">Total</span>
                  <span className="text-xl font-bold text-accent">₹{cartTotal.toFixed(2)}</span>
                </div>
                <a href="#/checkout" className="w-full block text-center bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-accent-hover">
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default CartPage;