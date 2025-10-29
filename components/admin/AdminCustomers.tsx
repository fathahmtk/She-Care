import React, { useMemo, useState, useEffect } from 'react';
// FIX: Add side-effect import to ensure JSX namespace is correctly augmented.
import '../../types';
import { useOrders } from '../../contexts/OrderContext';
import type { ShippingInfo } from '../../types';
import AdminEmptyState from './AdminEmptyState';
import EmptyCustomersIcon from '../icons/EmptyCustomersIcon';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from './PaginationControls';
import SearchIcon from '../icons/SearchIcon';

const CUSTOMERS_PER_PAGE = 10;

interface Customer extends ShippingInfo {
    orderCount: number;
    totalSpent: number;
}

const AdminCustomers: React.FC = () => {
  const { orders, loading } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    return customers.filter(customer => 
        customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const { currentPageData, currentPage, totalPages, setCurrentPage } = usePagination(filteredCustomers, CUSTOMERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  return (
    <div>
      <h1 className="text-4xl font-bold font-heading text-text-primary mb-8">Customers</h1>
      
      <div className="bg-surface p-4 rounded-xl border border-border-color mb-6">
        <div className="relative">
            <input
                type="text"
                placeholder="Search customers by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 border border-transparent bg-transparent rounded-md focus:ring-0 focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
            </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[rgb(var(--color-admin-bg))] text-xs text-text-primary uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium text-center">Orders</th>
                  <th className="px-6 py-3 font-medium text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {loading ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center text-text-secondary">Loading customer data...</td></tr>
                ) : currentPageData.length > 0 ? (
                    // FIX: Explicitly type 'customer' to resolve property access errors on 'unknown' type.
                    currentPageData.map((customer: Customer, index) => (
                  <tr key={index} className="hover:bg-accent/5">
                    <td className="px-6 py-4 font-semibold text-text-primary">{customer.fullName}</td>
                    <td className="px-6 py-4 text-text-secondary">{customer.city}, {customer.state}</td>
                    <td className="px-6 py-4 text-text-secondary text-center">{customer.orderCount}</td>
                    <td className="px-6 py-4 text-text-primary font-semibold text-right">₹{customer.totalSpent.toFixed(2)}</td>
                  </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>
                            <AdminEmptyState
                                icon={<EmptyCustomersIcon className="w-20 h-20 text-border-color" />}
                                title="No Customers Found"
                                description="Customer information will appear here after they place an order."
                            />
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

    </div>
  );
};

export default AdminCustomers;