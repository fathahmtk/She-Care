import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminOrders from '../../components/admin/AdminOrders';
import AdminProducts from '../../components/admin/AdminProducts';
import AdminCustomers from '../../components/admin/AdminCustomers';
import AdminSettings from '../../components/admin/AdminSettings';

import DashboardIcon from '../../components/icons/DashboardIcon';
import OrdersIcon from '../../components/icons/OrdersIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import CustomersIcon from '../../components/icons/CustomersIcon';
import SettingsIcon from '../../components/icons/SettingsIcon';
import Logo from '../../components/Logo';
import MenuIcon from '../../components/icons/MenuIcon';
import CloseIcon from '../../components/icons/CloseIcon';

type AdminView = 'dashboard' | 'orders' | 'products' | 'customers' | 'settings';

const AdminPage: React.FC = () => {
  const [view, setView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.split('/')[2] as AdminView;
        if (['dashboard', 'orders', 'products', 'customers', 'settings'].includes(hash)) {
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
      setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const renderView = () => {
    switch (view) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'customers':
        return <AdminCustomers />;
      case 'settings':
        return <AdminSettings />;
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
      <aside className={`fixed inset-y-0 left-0 w-64 bg-surface shadow-md flex-shrink-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-border-color">
            <Logo />
        </div>
        <nav className="p-4 space-y-2 flex-grow">
            <NavLink targetView="dashboard" icon={<DashboardIcon className="w-6 h-6" />}>Dashboard</NavLink>
            <NavLink targetView="orders" icon={<OrdersIcon className="w-6 h-6" />}>Orders</NavLink>
            <NavLink targetView="products" icon={<ProductsIcon className="w-6 h-6" />}>Products</NavLink>
            <NavLink targetView="customers" icon={<CustomersIcon className="w-6 h-6" />}>Customers</NavLink>
            <NavLink targetView="settings" icon={<SettingsIcon className="w-6 h-6" />}>Site Settings</NavLink>
        </nav>
        <div className="p-4 border-t border-border-color">
            <a href="#" className="text-sm text-text-secondary hover:text-accent">&larr; Back to Storefront</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center p-4 bg-surface border-b border-border-color sticky top-0 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle menu" className="p-2">
            {isSidebarOpen ? <CloseIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
          </button>
          <div className="flex-grow flex justify-center">
            <Logo />
          </div>
          <div className="w-8"></div> {/* Spacer to balance the button */}
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>

       {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default AdminPage;