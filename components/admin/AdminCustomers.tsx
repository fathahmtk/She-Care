import React, { useMemo } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';
import { useOrders } from '../../contexts/OrderContext';
import type { ShippingInfo } from '../../types';
import AdminEmptyState from './AdminEmptyState';
import EmptyCustomersIcon from '../icons/EmptyCustomersIcon';

interface Customer extends ShippingInfo {
    orderCount: number;
    totalSpent: number;
}

const AdminCustomers: React.FC = () => {
  const { orders, loading } = useOrders();

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
      const customerEmail = `${order.customer.fullName}-${order.customer.zipCode}`.toLowerCase(); // Simple unique identifier
      if (customerMap.has(customerEmail)) {
        const existing = customerMap.get(customerEmail)!;
        existing.orderCount += 1;
        existing.totalSpent += order.total;
      } else {
        customerMap.set(customerEmail, {
          ...order.customer,
          orderCount: 1,
          totalSpent: order.total,
        });
      }
    });

    return Array.from(customerMap.values()).sort((a,b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Customers</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border-color bg-surface/50">
            <tr>
              <th className="p-3 text-sm font-semibold text-text-secondary">Name</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Location</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Orders</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={4} className="p-4 text-center text-text-secondary">Loading customer data...</td></tr>
            ) : customers.length > 0 ? (
                customers.map((customer, index) => (
              <tr key={index} className="border-b border-border-color last:border-b-0 hover:bg-accent/5">
                <td className="p-3 text-sm text-text-primary font-semibold">{customer.fullName}</td>
                <td className="p-3 text-sm text-text-secondary">{customer.city}, {customer.state}</td>
                <td className="p-3 text-sm text-text-secondary text-center">{customer.orderCount}</td>
                <td className="p-3 text-sm text-text-primary font-semibold">₹{customer.totalSpent.toFixed(2)}</td>
              </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4}>
                        <AdminEmptyState
                            icon={<EmptyCustomersIcon className="w-20 h-20 text-border-color" />}
                            title="No Customers Yet"
                            description="Customer information will appear here after they place an order."
                        />
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {loading && <p className="text-center text-text-secondary">Loading customer data...</p>}
        {customers.map((customer, index) => (
          <div key={index} className="bg-surface rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-text-primary">{customer.fullName}</p>
                    <p className="text-sm text-text-secondary">{customer.city}, {customer.state}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm text-text-secondary">Total Spent</p>
                    <p className="font-bold text-accent text-lg">₹{customer.totalSpent.toFixed(2)}</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border-color">
                <p className="text-sm text-text-secondary">Orders: <span className="font-semibold text-text-primary">{customer.orderCount}</span></p>
            </div>
          </div>
        ))}
        {!loading && customers.length === 0 && (
          <AdminEmptyState
            icon={<EmptyCustomersIcon className="w-20 h-20 text-border-color" />}
            title="No Customers Yet"
            description="Customer information will appear here after they place an order."
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;