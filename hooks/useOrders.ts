import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../types';

const STORAGE_KEY = 'shecarehub-orders';

const getOrdersFromStorage = (): Order[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Could not parse orders from localStorage", error);
    return [];
  }
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(getOrdersFromStorage);
  const [_, setTick] = useState(0); // Used to force re-renders on storage change

  // This effect listens for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setOrders(getOrdersFromStorage());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Force refresh when local state might not be in sync
  const refreshOrders = useCallback(() => {
      setOrders(getOrdersFromStorage());
      setTick(tick => tick + 1); // Force update for components using the hook
  }, []);

  const addOrder = (newOrder: Order) => {
    const currentOrders = getOrdersFromStorage();
    const updatedOrders = [...currentOrders, newOrder];
    setOrders(updatedOrders);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const currentOrders = getOrdersFromStorage();
    const updatedOrders = currentOrders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  };
  
  const getOrderById = (orderId: string): Order | undefined => {
      return orders.find(order => order.id === orderId);
  }

  return { orders, addOrder, updateOrderStatus, getOrderById, refreshOrders };
};