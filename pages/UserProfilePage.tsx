import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import AnimatedSection from '../components/AnimatedSection';
import ReceiptIcon from '../components/icons/ReceiptIcon';
import type { Order } from '../types';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    const statusClasses = {
        Pending: 'bg-gray-500/20 text-gray-400',
        Processing: 'bg-yellow-500/20 text-yellow-400',
        Shipped: 'bg-blue-500/20 text-blue-400',
        Delivered: 'bg-green-500/20 text-green-400',
        Cancelled: 'bg-red-500/20 text-red-400',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const UserProfilePage: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const { isAuthenticated, user } = useAuth();
  const { orders, loading } = useOrders();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto text-center py-48 px-6">
        <h1 className="text-4xl font-heading text-accent">Access Denied</h1>
        <p className="text-lg text-text-secondary mt-4">Please log in to view your profile.</p>
        <button 
          onClick={onLoginClick}
          className="mt-8 inline-block bg-accent text-surface font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out">
            Login
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(order => order.customer.fullName === user.name);

  return (
    <AnimatedSection>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-heading text-accent mb-12 text-center">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Profile Details */}
            <div className="lg:col-span-1">
                <div className="bg-surface p-6 rounded-lg shadow-md sticky top-32">
                    <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-color pb-3">Profile Details</h2>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-semibold text-text-secondary">Name</p>
                            <p className="text-text-primary">{user.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-text-secondary">Email</p>
                            <p className="text-text-primary">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order History */}
            <div className="lg:col-span-2">
                <div className="bg-surface p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-text-primary mb-4">Order History</h2>
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-text-secondary">Loading your orders...</p>
                        </div>
                    ) : userOrders.length > 0 ? (
                        <div className="space-y-6">
                            {userOrders.map(order => (
                                <div key={order.id} className="border border-border-color rounded-lg p-4 transition-shadow hover:shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                        <div>
                                            <p className="font-semibold text-text-primary">Order #{order.id}</p>
                                            <p className="text-sm text-text-secondary">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                                        </div>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <div className="border-t border-border-color pt-3">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between text-sm py-1">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.imageUrls[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md"/>
                                                    <span>{item.name} <span className="text-text-secondary">x {item.quantity}</span></span>
                                                </div>
                                                <span className="text-text-secondary">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-border-color mt-3 pt-3 text-right">
                                        <p className="font-semibold text-text-primary">Total: <span className="text-accent text-lg">₹{order.total.toFixed(2)}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <ReceiptIcon className="w-20 h-20 text-border-color mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-text-primary">No orders found</h3>
                            <p className="text-text-secondary mt-2 mb-6">You haven't placed any orders with us yet.</p>
                            <a href="#" className="bg-accent text-surface font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out">
                                Start Shopping
                            </a>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default UserProfilePage;