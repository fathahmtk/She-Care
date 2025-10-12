import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Product } from '../types';

/**
 * Defines the shape of the cart context, including the cart items
 * and a function to add items to the cart.
 */
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
}

// Create the context with an undefined default value.
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * The CartProvider component wraps the application and provides the cart state
 * and functionality to all child components.
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  /**
   * Adds a product to the cart.
   * For this implementation, we simply append the product to the array.
   * A more complex implementation might handle quantities.
   * @param {Product} product - The product to add to the cart.
   */
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      console.log(`Adding ${product.name} to cart.`);
      const newCart = [...prevItems, product];
      console.log('Current cart items:', newCart.map(p => p.name));
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * A custom hook to easily access the cart context.
 * This abstracts away the `useContext` hook and provides error handling.
 * @returns {CartContextType} The cart context.
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // This error is thrown if useCart is used outside of a CartProvider.
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
