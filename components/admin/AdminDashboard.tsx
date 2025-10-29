import React, { useMemo } from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import OrdersIcon from '../icons/OrdersIcon';
import ProductsIcon from '../icons/ProductsIcon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-surface p-6 rounded-xl border border-border-color flex items-center gap-5">
    <div className="bg-accent/10 text-accent p-3 rounded-lg flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold font-heading text-text-primary mt-1">{value}</p>
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

  const monthlyRevenue = useMemo(() => {
    const revenueByMonth: { [key: string]: number } = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    for (let i = 0; i < 6; i++) {
        const month = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
        const monthKey = month.toLocaleString('default', { month: 'short' });
        revenueByMonth[monthKey] = 0;
    }
    
    orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        if (orderDate >= sixMonthsAgo) {
            const monthKey = orderDate.toLocaleString('default', { month: 'short' });
            revenueByMonth[monthKey] += order.total;
        }
    });

    return Object.entries(revenueByMonth).map(([month, total]) => ({ month, total }));
  }, [orders]);

  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.total), 1);

  return (
    <div>
      <h1 className="text-4xl font-bold font-heading text-text-primary mb-8">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="bg-surface p-6 rounded-xl border border-border-color h-28"></div>
            <div className="bg-surface p-6 rounded-xl border border-border-color h-28"></div>
            <div className="bg-surface p-6 rounded-xl border border-border-color h-28"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
            icon={<span className="text-2xl font-bold">₹</span>}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 bg-surface p-6 rounded-xl border border-border-color">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Monthly Revenue</h2>
            {isLoading ? (
                <div className="h-80 bg-border-color/20 rounded-lg animate-pulse"></div>
            ) : monthlyRevenue.length > 0 ? (
                <div className="flex justify-around items-end h-80 pt-4 pb-8 relative">
                    {monthlyRevenue.map(({ month, total }) => (
                        <div key={month} className="flex flex-col items-center h-full justify-end group w-1/6">
                            <div className="relative w-full flex justify-center">
                                <span className="absolute bottom-full mb-2 text-xs bg-black/80 dark:bg-white/20 text-white dark:text-text-primary px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    ₹{total.toLocaleString('en-IN')}
                                </span>
                                <div
                                    className="w-1/2 bg-accent/20 hover:bg-accent/40 transition-all rounded-t-md"
                                    style={{ height: `${(total / maxRevenue) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-text-secondary mt-2 absolute bottom-0">{month}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-text-secondary py-16">Not enough order data to display chart.</p>
            )}
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-border-color">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Orders</h2>
            <div className="space-y-4">
            {isLoading ? (
                 Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-border-color/20 rounded-md animate-pulse"></div>)
            ) : recentOrders.length > 0 ? recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                    <div>
                        <p className="font-semibold text-text-primary">{order.customer.fullName}</p>
                        <p className="text-xs text-text-secondary">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-accent">₹{order.total.toFixed(2)}</p>
                        <span className={`px-2 py-0.5 mt-1 text-xs font-semibold rounded-full inline-block ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                            order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' :
                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                            'bg-gray-500/20 text-gray-500'
                        }`}>{order.status}</span>
                    </div>
                </div>
            )) : (
                <p className="text-center text-text-secondary py-16">No recent orders found.</p>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;