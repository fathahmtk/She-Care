import React from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../../types';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import OrdersIcon from '../icons/OrdersIcon';
import ProductsIcon from '../icons/ProductsIcon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-surface p-6 rounded-lg shadow-sm flex items-center">
    <div className="bg-accent/10 text-accent p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);
  
  const isLoading = ordersLoading || productsLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
            <div className="bg-surface p-6 rounded-lg shadow-sm h-24"></div>
            <div className="bg-surface p-6 rounded-lg shadow-sm h-24"></div>
            <div className="bg-surface p-6 rounded-lg shadow-sm h-24"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString('en-IN')}`} 
            icon={<span className="text-2xl">₹</span>}
            />
            <StatCard 
            title="Total Orders" 
            value={totalOrders} 
            icon={<OrdersIcon className="w-6 h-6"/>}
            />
            <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon={<ProductsIcon className="w-6 h-6" />}
            />
        </div>
      )}

      <div className="bg-surface p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-color bg-surface/50">
                <th className="p-3 text-sm font-semibold text-text-secondary">Order ID</th>
                <th className="p-3 text-sm font-semibold text-text-secondary">Customer</th>
                <th className="p-3 text-sm font-semibold text-text-secondary">Date</th>
                <th className="p-3 text-sm font-semibold text-text-secondary">Total</th>
                <th className="p-3 text-sm font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr><td colSpan={5} className="p-4 text-center text-text-secondary">Loading recent orders...</td></tr>
              ) : recentOrders.length > 0 ? recentOrders.map(order => (
                <tr key={order.id} className="border-b border-border-color hover:bg-accent/5">
                  <td className="p-3 text-sm text-text-primary font-mono">{order.id.slice(-6)}</td>
                  <td className="p-3 text-sm text-text-secondary">{order.customer.fullName}</td>
                  <td className="p-3 text-sm text-text-secondary">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-text-primary font-semibold">₹{order.total.toFixed(2)}</td>
                  <td className="p-3 text-sm">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>{order.status}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-text-secondary">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;