import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../types';
import * as api from '../utils/api';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (newOrder: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (newOrder: Order) => {
    await api.addOrder(newOrder);
    await fetchOrders();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    await fetchOrders();
  };
  
  const getOrderById = (orderId: string): Order | undefined => {
      return orders.find(order => order.id === orderId);
  }

  const value = { orders, loading, error, addOrder, updateOrderStatus, getOrderById };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
