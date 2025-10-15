import React, { useState, useMemo } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';
import { useOrders, } from '../../contexts/OrderContext';
import type { Order, OrderStatus } from '../../types';
import AdminOrderDetail from './AdminOrderDetail';
import AdminEmptyState from './AdminEmptyState';
import EmptyOrdersIcon from '../icons/EmptyOrdersIcon';

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
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  
  const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Manage Orders</h1>

      <div className="bg-surface p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="status-filter" className="text-sm font-medium text-text-secondary mr-2">Filter by Status:</label>
          <select id="status-filter" value={filter} onChange={e => setFilter(e.target.value as any)} className="p-2 border border-border-color bg-surface rounded-md text-sm focus:ring-accent focus:border-accent">
            <option value="All">All</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort-order" className="text-sm font-medium text-text-secondary mr-2">Sort by:</label>
          <select id="sort-order" value={sort} onChange={e => setSort(e.target.value as any)} className="p-2 border border-border-color bg-surface rounded-md text-sm focus:ring-accent focus:border-accent">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Total (High to Low)</option>
            <option value="total-asc">Total (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border-color bg-surface/50">
            <tr>
              <th className="p-3 text-sm font-semibold text-text-secondary">Order ID</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Date</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Customer</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Total</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Status</th>
              <th className="p-3 text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-text-secondary">Loading orders...</td></tr>
            ) : filteredAndSortedOrders.length > 0 ? (
              filteredAndSortedOrders.map(order => (
                <tr key={order.id} className="border-b border-border-color hover:bg-accent/5">
                  <td className="p-3 text-sm text-text-primary font-mono">{order.id}</td>
                  <td className="p-3 text-sm text-text-secondary">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="p-3 text-sm text-text-secondary">{order.customer.fullName}</td>
                  <td className="p-3 text-sm text-text-primary font-semibold">₹{order.total.toFixed(2)}</td>
                  <td className="p-3 text-sm">
                     <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`p-1 text-xs font-semibold rounded-md border-2 bg-transparent focus:ring-1 focus:ring-accent ${
                              order.status === 'Delivered' ? 'border-green-500/40 text-green-400' :
                              order.status === 'Shipped' ? 'border-blue-500/40 text-blue-400' :
                              order.status === 'Processing' ? 'border-yellow-500/40 text-yellow-400' :
                              order.status === 'Cancelled' ? 'border-red-500/40 text-red-400' :
                              'border-gray-500/40 text-gray-400'
                          }`}
                      >
                          {statusOptions.map(s => <option className="bg-surface text-text-primary" key={s} value={s}>{s}</option>)}
                      </select>
                  </td>
                  <td className="p-3 text-sm">
                    <button onClick={() => setSelectedOrder(order)} className="text-accent hover:underline font-semibold">View Details</button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="p-4 text-center text-text-secondary">No orders found for the selected filter.</td>
                </tr>
            )}
            {!loading && orders.length === 0 && (
                 <tr>
                    <td colSpan={6}>
                        <AdminEmptyState
                            icon={<EmptyOrdersIcon className="w-20 h-20 text-border-color" />}
                            title="No Orders Yet"
                            description="When a new order is placed by a customer, it will appear here."
                        />
                    </td>
                 </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedOrder && (
          <AdminOrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default AdminOrders;