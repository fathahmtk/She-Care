import React, { useState } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { ShippingInfo, PaymentInfo, Order } from '../types';
import { useCart } from '../contexts/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import { useOrders } from '../contexts/OrderContext';

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '', address: '', city: '', state: '', zipCode: '', country: 'India'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '', expiryDate: '', cvv: '', nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        customer: shippingInfo,
        items: cartItems,
        total: cartTotal,
        status: 'Pending',
        payment: paymentInfo
    };

    await addOrder(newOrder);
    clearCart();
    setIsProcessing(false);
    window.location.hash = '#/confirmation';
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'shipping' | 'payment') => {
      const { name, value } = e.target;
      if (form === 'shipping') {
          setShippingInfo(prev => ({...prev, [name]: value}));
      } else {
          setPaymentInfo(prev => ({...prev, [name]: value}));
      }
  };
  
  if (cartItems.length === 0 && step !== 3) {
      setTimeout(() => {
        if(window.location.hash === '#/checkout') {
            window.location.hash = '#/cart';
        }
      }, 50);
      return null;
  }

  return (
    <AnimatedSection>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-heading text-accent mb-8 text-center">Checkout</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="bg-surface p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-8">
              <div className="flex items-center text-accent">
                <div className="rounded-full transition duration-500 ease-in-out h-8 w-8 flex items-center justify-center border-2 border-accent bg-accent text-surface">1</div>
                <span className="font-semibold ml-2">Shipping</span>
              </div>
              <div className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-4 ${step > 1 ? 'border-accent' : 'border-border-color'}`}></div>
              <div className={`flex items-center ${step > 1 ? 'text-accent' : 'text-text-secondary'}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-8 w-8 flex items-center justify-center border-2 ${step > 1 ? 'border-accent bg-accent text-surface' : 'border-border-color'}`}>2</div>
                <span className="font-semibold ml-2">Payment</span>
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-text-primary">Shipping Information</h2>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input type="text" name="fullName" value={shippingInfo.fullName} onChange={e => handleInputChange(e, 'shipping')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
                  <input type="text" name="address" value={shippingInfo.address} onChange={e => handleInputChange(e, 'shipping')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                      <input type="text" name="city" value={shippingInfo.city} onChange={e => handleInputChange(e, 'shipping')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                      <input type="text" name="state" value={shippingInfo.state} onChange={e => handleInputChange(e, 'shipping')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Zip Code</label>
                      <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={e => handleInputChange(e, 'shipping')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                      <input type="text" name="country" value={shippingInfo.country} readOnly className="w-full px-4 py-2 bg-border-color/20 border border-border-color rounded-md" />
                    </div>
                 </div>
                <button type="submit" className="w-full mt-6 bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg hover:bg-accent-hover">Continue to Payment</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-text-primary">Payment Details</h2>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Name on Card</label>
                  <input type="text" name="nameOnCard" value={paymentInfo.nameOnCard} onChange={e => handleInputChange(e, 'payment')} required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Card Number</label>
                  <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={e => handleInputChange(e, 'payment')} required placeholder="XXXX XXXX XXXX XXXX" className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Expiry Date</label>
                    <input type="text" name="expiryDate" value={paymentInfo.expiryDate} onChange={e => handleInputChange(e, 'payment')} required placeholder="MM/YY" className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">CVV</label>
                    <input type="text" name="cvv" value={paymentInfo.cvv} onChange={e => handleInputChange(e, 'payment')} required placeholder="123" className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
                 <div className="flex items-center justify-between mt-8">
                    <button type="button" onClick={() => setStep(1)} className="text-accent hover:underline"> &larr; Back to Shipping</button>
                    <button type="submit" disabled={isProcessing} className="bg-accent text-surface py-3 px-8 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider hover:bg-accent-hover disabled:opacity-70 disabled:cursor-not-allowed">
                        {isProcessing ? 'Processing...' : `Pay ₹${cartTotal.toFixed(2)}`}
                    </button>
                </div>
              </form>
            )}

          </div>

          <div className="bg-surface/50 p-8 rounded-lg h-fit sticky top-32">
              <h2 className="text-2xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Your Order</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar pr-2">
                  {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-text-primary">{item.name}</p>
                                <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                  ))}
              </div>
               <div className="border-t border-border-color mt-4 pt-4 space-y-2">
                   <div className="flex justify-between">
                       <p className="text-text-secondary">Subtotal</p>
                       <p className="font-semibold">₹{cartTotal.toFixed(2)}</p>
                   </div>
                   <div className="flex justify-between">
                       <p className="text-text-secondary">Shipping</p>
                       <p className="font-semibold">FREE</p>
                   </div>
                   <div className="flex justify-between text-xl font-bold border-t border-border-color mt-2 pt-2">
                       <p>Total</p>
                       <p className="text-accent">₹{cartTotal.toFixed(2)}</p>
                   </div>
               </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CheckoutPage;