import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// FIX: Import 'CartItem' and 'Product' types to resolve 'Cannot find name' errors.
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
    try {
        const item = window.localStorage.getItem('shecarehub-cart');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Could not parse cart from localStorage", error);
        return [];
    }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  useEffect(() => {
    try {
        window.localStorage.setItem('shecarehub-cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Could not save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
      if (quantity < 1) {
          removeFromCart(productId);
          return;
      }
      setCartItems(prevItems => prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};