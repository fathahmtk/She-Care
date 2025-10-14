import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Product } from '../types';
import { PRODUCTS as initialProducts } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: number) => void;
  getProductById: (productId: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getInitialProducts = (): Product[] => {
    try {
        const item = window.localStorage.getItem('shecarehub-products');
        // If local storage is empty, seed it with the initial data.
        if (!item) {
            window.localStorage.setItem('shecarehub-products', JSON.stringify(initialProducts));
            return initialProducts;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error("Could not parse products from localStorage", error);
        return initialProducts;
    }
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(getInitialProducts);

  useEffect(() => {
    try {
        window.localStorage.setItem('shecarehub-products', JSON.stringify(products));
    } catch (error) {
        console.error("Could not save products to localStorage", error);
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prevProducts => {
      const newProduct: Product = {
        ...productData,
        id: Date.now(), // Simple unique ID generation
      };
      return [...prevProducts, newProduct];
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const getProductById = (productId: number): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};