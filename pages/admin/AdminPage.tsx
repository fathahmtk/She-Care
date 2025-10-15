import React, { useState, useEffect } from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../../types';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminOrders from '../../components/admin/AdminOrders';
import AdminProducts from '../../components/admin/AdminProducts';
import AdminCustomers from '../../components/admin/AdminCustomers';

import DashboardIcon from '../../components/icons/DashboardIcon';
import OrdersIcon from '../../components/icons/OrdersIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import CustomersIcon from '../../components/icons/CustomersIcon';
import Logo from '../../components/Logo';

type AdminView = 'dashboard' | 'orders' | 'products' | 'customers';

const AdminPage: React.FC = () => {
  const [view, setView] = useState<AdminView>('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.split('/')[2] as AdminView;
        if (['dashboard', 'orders', 'products', 'customers'].includes(hash)) {
            setView(hash);
        } else {
            setView('dashboard');
        }
    };
    
    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const handleNavClick = (newView: AdminView) => {
      setView(newView);
      window.location.hash = `#/admin/${newView}`;
  };

  const renderView = () => {
    switch (view) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'customers':
        return <AdminCustomers />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  const NavLink: React.FC<{
    targetView: AdminView;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ targetView, icon, children }) => (
    <button
      onClick={() => handleNavClick(targetView)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
        view === targetView
          ? 'bg-accent/20 text-accent font-semibold'
          : 'text-text-secondary hover:bg-black/10 dark:hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-background-start text-text-primary font-body transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-surface shadow-md flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-border-color">
            <Logo />
        </div>
        <nav className="p-4 space-y-2 flex-grow">
            <NavLink targetView="dashboard" icon={<DashboardIcon className="w-6 h-6" />}>Dashboard</NavLink>
            <NavLink targetView="orders" icon={<OrdersIcon className="w-6 h-6" />}>Orders</NavLink>
            <NavLink targetView="products" icon={<ProductsIcon className="w-6 h-6" />}>Products</NavLink>
            <NavLink targetView="customers" icon={<CustomersIcon className="w-6 h-6" />}>Customers</NavLink>
        </nav>
        <div className="p-4 border-t border-border-color">
            <a href="#" className="text-sm text-text-secondary hover:text-accent">&larr; Back to Storefront</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminPage;