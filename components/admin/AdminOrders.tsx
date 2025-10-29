import React, { useState, useMemo, useEffect } from 'react';
// FIX: Add side-effect import to ensure JSX namespace is correctly augmented.
import '../../types';
import { Order, OrderStatus } from '../../types';
import { useOrders, } from '../../contexts/OrderContext';
import AdminOrderDetail from './AdminOrderDetail';
import AdminEmptyState from './AdminEmptyState';
import EmptyOrdersIcon from '../icons/EmptyOrdersIcon';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from './PaginationControls';

const ORDERS_PER_PAGE = 10;

const AdminOrders: React.FC = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [sort, setSort] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    if (filter !== 'All') {
      result = result.filter(order => order.status === filter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'date-asc': return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case 'total-desc': return b.total - a.total;
        case 'total-asc': return a.total - b.total;
        case 'date-desc':
        default:
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
    });

    return result;
  }, [orders, filter, sort]);

  const { currentPageData, currentPage, totalPages, setCurrentPage } = usePagination(filteredAndSortedOrders, ORDERS_PER_PAGE);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort, setCurrentPage]);
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  
  const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const inputStyles = "p-2 border border-border-color bg-surface rounded-md text-sm focus:ring-1 focus:ring-accent focus:border-accent";

  return (
    <div>
      <h1 className="text-4xl font-bold font-heading text-text-primary mb-8">Manage Orders</h1>

      <div className="bg-surface p-4 rounded-xl border border-border-color mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-grow flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium text-text-secondary">Status</label>
                <select id="status-filter" value={filter} onChange={e => setFilter(e.target.value as any)} className={inputStyles}>
                    <option value="All">All</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="sort-order" className="text-sm font-medium text-text-secondary">Sort by</label>
                <select id="sort-order" value={sort} onChange={e => setSort(e.target.value as any)} className={inputStyles}>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="total-desc">Total (High to Low)</option>
                    <option value="total-asc">Total (Low to High)</option>
                </select>
            </div>
        </div>
      </div>
      
      <div className="bg-surface rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[rgb(var(--color-admin-bg))] text-xs text-text-primary uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {loading ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-text-secondary">Loading orders...</td></tr>
                ) : currentPageData.length > 0 ? (
                  // FIX: Explicitly type 'order' to resolve property access errors on 'unknown' type.
                  currentPageData.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-accent/5">
                      <td className="px-6 py-4 font-mono text-text-primary font-medium">{order.id}</td>
                      <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{new Date(order.orderDate).toLocaleString()}</td>
                      <td className="px-6 py-4 text-text-secondary">{order.customer.fullName}</td>
                      <td className="px-6 py-4 text-text-primary font-semibold">₹{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                         <select 
                              value={order.status} 
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              aria-label={`Update status for order ${order.id}`}
                              className={`p-1.5 text-xs font-semibold rounded-md border-2 bg-transparent focus:ring-1 focus:ring-accent w-full max-w-[120px] ${
                                  order.status === 'Delivered' ? 'border-green-500/40 text-green-500' :
                                  order.status === 'Shipped' ? 'border-blue-500/40 text-blue-500' :
                                  order.status === 'Processing' ? 'border-yellow-500/40 text-yellow-500' :
                                  order.status === 'Cancelled' ? 'border-red-500/40 text-red-500' :
                                  'border-gray-500/40 text-gray-500'
                              }`}
                          >
                              {statusOptions.map(s => <option className="bg-surface text-text-primary" key={s} value={s}>{s}</option>)}
                          </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedOrder(order)} className="text-accent hover:underline font-semibold text-sm">View Details</button>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan={6}>
                           {orders.length === 0 ? (
                                <AdminEmptyState
                                    icon={<EmptyOrdersIcon className="w-20 h-20 text-border-color" />}
                                    title="No Orders Yet"
                                    description="When a new order is placed by a customer, it will appear here."
                                />
                           ) : (
                                <div className="text-center py-16 px-6 text-text-secondary">No orders found for the selected filter.</div>
                           )}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
         <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      
      {selectedOrder && (
          <AdminOrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default AdminOrders;