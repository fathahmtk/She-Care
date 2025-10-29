import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
// FIX: Import the 'Product' type to resolve 'Cannot find name' errors.
import { Product } from '../types';
import * as api from '../utils/api';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  getProductById: (productId: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    await api.addProduct(productData);
    await fetchProducts(); // Refetch to get the updated list
  };

  const updateProduct = async (updatedProduct: Product) => {
    await api.updateProduct(updatedProduct);
    await fetchProducts();
  };

  const deleteProduct = async (productId: number) => {
    await api.deleteProduct(productId);
    await fetchProducts();
  };

  const getProductById = (productId: number): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  const value = { products, loading, error, addProduct, updateProduct, deleteProduct, getProductById };

  return (
    <ProductContext.Provider value={value}>
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