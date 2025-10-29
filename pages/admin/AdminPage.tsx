import React, { useState, useEffect } from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminOrders from '../../components/admin/AdminOrders';
import AdminProducts from '../../components/admin/AdminProducts';
import AdminCustomers from '../../components/admin/AdminCustomers';
import AdminSettings from '../../components/admin/AdminSettings';
import BrandLogo from '../../components/BrandLogo';
import DashboardIcon from '../../components/icons/DashboardIcon';
import OrdersIcon from '../../components/icons/OrdersIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import CustomersIcon from '../../components/icons/CustomersIcon';
import SettingsIcon from '../../components/icons/SettingsIcon';
import MenuIcon from '../../components/icons/MenuIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';

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
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-lg text-sm font-medium ${
        view === targetView
          ? 'bg-accent text-surface shadow-sm'
          : 'text-text-secondary hover:bg-accent/10 hover:text-accent'
      }`}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[rgb(var(--color-admin-bg))] text-text-primary font-body overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-border-color flex-shrink-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-5 border-b border-border-color h-20 flex items-center">
            <a href="#/admin" aria-label="Admin Dashboard Home">
              <BrandLogo className="h-10 w-auto" />
            </a>
        </div>
        <nav className="p-4 space-y-2 flex-grow">
            <NavLink targetView="dashboard" icon={<DashboardIcon className="w-5 h-5" />}>Dashboard</NavLink>
            <NavLink targetView="orders" icon={<OrdersIcon className="w-5 h-5" />}>Orders</NavLink>
            <NavLink targetView="products" icon={<ProductsIcon className="w-5 h-5" />}>Products</NavLink>
            <NavLink targetView="customers" icon={<CustomersIcon className="w-5 h-5" />}>Customers</NavLink>
            <NavLink targetView="settings" icon={<SettingsIcon className="w-5 h-5" />}>Site Settings</NavLink>
        </nav>
        <div className="p-4 border-t border-border-color">
            <a href="#" className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent font-medium">
                <ArrowLeftIcon className="w-4 h-4"/>
                <span>Back to Storefront</span>
            </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-surface border-b border-border-color h-20 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle menu" className="p-2 md:hidden">
            {isSidebarOpen ? <CloseIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
          </button>
          <div className="flex-1">
             {/* Search or other header items can go here */}
          </div>
          <div className="text-right">
             <span className="text-sm text-text-secondary">Admin Panel</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
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