import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import { Order } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
// FIX: Import BrandLogo directly to use props like 'variant' for the print version.
import BrandLogo from '../BrandLogo';
import CloseIcon from '../icons/CloseIcon';
import PrintIcon from '../icons/PrintIcon';
import ShipIcon from '../icons/ShipIcon';

interface AdminOrderDetailProps {
  order: Order;
  onClose: () => void;
}

const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ order, onClose }) => {
  const { settings } = useSettings();

  const printStyles = `
    @media print {
      body * { visibility: hidden; }
      @page { size: auto; margin: 0; }
      .print-no-break { page-break-inside: avoid; }
      .print-text-black { color: black !important; }

      /* Invoice Printing Styles */
      body.printing-invoice #invoice-content, body.printing-invoice #invoice-content * { visibility: visible; }
      body.printing-invoice #invoice-content {
        display: block; position: absolute; left: 0; top: 0; width: 100%;
        padding: 2rem; font-size: 12px; background: white !important; color: black !important;
      }

      /* Shipping Label Printing Styles */
      body.printing-label #shipping-label-content, body.printing-label #shipping-label-content * { visibility: visible; }
      body.printing-label #shipping-label-content {
        display: block; position: absolute; left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        width: 4in; height: 6in; padding: 0.25in;
        border: 2px dashed #000; font-family: sans-serif; color: black !important;
      }
    }
  `;
  
  const handlePrint = (type: 'invoice' | 'label') => {
    document.body.classList.add(`printing-${type}`);
    window.print();
    document.body.classList.remove(`printing-${type}`);
  }

  return (
    <>
    <style>{printStyles}</style>
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-border-color">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Order Details</h2>
            <p className="text-sm text-text-secondary font-mono">#{order.id}</p>
          </div>
          <div>
            <button onClick={() => handlePrint('label')} className="text-text-secondary hover:text-accent p-2 rounded-lg transition-colors hover:bg-accent/10 mr-1" aria-label="Print shipping label">
                <ShipIcon className="w-5 h-5"/>
            </button>
            <button onClick={() => handlePrint('invoice')} className="text-text-secondary hover:text-accent p-2 rounded-lg transition-colors hover:bg-accent/10 mr-1" aria-label="Print invoice">
                <PrintIcon className="w-5 h-5"/>
            </button>
            <button onClick={onClose} className="text-text-secondary hover:text-accent p-2 rounded-lg transition-colors hover:bg-accent/10" aria-label="Close order details">
                <CloseIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto text-text-primary">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Billed To:</h4>
                    <address className="not-italic text-text-secondary text-sm leading-relaxed">
                        {order.customer.fullName}<br/>
                        {order.customer.address}<br/>
                        {order.customer.city}, {order.customer.state} {order.customer.zipCode}<br/>
                        {order.customer.country}
                    </address>
                </div>
                <div className="text-left sm:text-right">
                    <h4 className="font-semibold text-text-primary mb-1 text-sm uppercase tracking-wider">Order Info:</h4>
                    <p className="text-text-secondary text-sm">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p className="text-text-secondary text-sm">Status: <span className="font-semibold text-accent">{order.status}</span></p>
                    <p className="text-text-secondary text-sm">Card: **** {order.payment.cardNumber.slice(-4)}</p>
                </div>
            </div>
             <table className="w-full text-left mb-6 text-sm">
                <thead className="border-b-2 border-border-color bg-black/5 dark:bg-white/5">
                    <tr>
                        <th className="p-3 font-semibold text-text-secondary">Item</th>
                        <th className="p-3 font-semibold text-text-secondary text-center">Qty</th>
                        <th className="p-3 font-semibold text-text-secondary text-right">Price</th>
                        <th className="p-3 font-semibold text-text-secondary text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id} className="border-b border-border-color">
                            <td className="p-3 text-text-primary font-medium">{item.name}</td>
                            <td className="p-3 text-text-secondary text-center">{item.quantity}</td>
                            <td className="p-3 text-text-secondary text-right">₹{item.price.toFixed(2)}</td>
                            <td className="p-3 text-text-primary font-semibold text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span>₹{order.total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-text-secondary"><span>Shipping</span><span className="font-medium text-green-600">FREE</span></div>
                    <div className="flex justify-between text-lg font-bold text-text-primary border-t-2 border-border-color mt-2 pt-2"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
      </div>
    </div>
    
    {/* Hidden, print-only content */}
    <div className="hidden">
      {/* Invoice Content for Printing */}
      <div id="invoice-content" className="print-text-black">
        <div className="flex justify-between items-start mb-6">
            <div><BrandLogo variant="solid" className="h-10 w-auto"/> <p className="text-sm mt-2">shecarehub.com</p></div>
            <div className="text-right">
                <h3 className="text-2xl font-bold">Invoice</h3>
                <p>Order #{order.id}</p><p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 border-t pt-4 print-no-break">
            <div>
                <h4 className="font-semibold mb-1">Billed To:</h4>
                <address className="not-italic">{order.customer.fullName}<br/>{order.customer.address}<br/>{order.customer.city}, {order.customer.state} {order.customer.zipCode}<br/>{order.customer.country}</address>
            </div>
            <div>
                <h4 className="font-semibold mb-1">Payment Details:</h4>
                <p>Status: <span className="font-semibold">Paid</span></p>
                <p>Card: **** **** **** {order.payment.cardNumber.slice(-4)}</p>
            </div>
        </div>
        <table className="w-full text-left mb-6 print-no-break">
            <thead className="border-b"><tr><th className="p-2 text-sm font-semibold">Item</th><th className="p-2 text-sm font-semibold text-center">Qty</th><th className="p-2 text-sm font-semibold text-right">Price</th><th className="p-2 text-sm font-semibold text-right">Total</th></tr></thead>
            <tbody>{order.items.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">₹{item.price.toFixed(2)}</td><td className="p-2 font-semibold text-right">₹{(item.price * item.quantity).toFixed(2)}</td></tr>))}</tbody>
        </table>
        <div className="flex justify-end print-no-break">
            <div className="w-full max-w-xs space-y-1"><div className="flex justify-between"><span>Subtotal</span><span>₹{order.total.toFixed(2)}</span></div><div className="flex justify-between mb-1"><span>Shipping</span><span>₹0.00</span></div><div className="flex justify-between text-xl font-bold border-t pt-2"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div></div>
        </div>
        <p className="text-center mt-8 text-sm">Thank you for your business!</p>
      </div>

      {/* Shipping Label Content for Printing */}
       <div id="shipping-label-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>SheCareHub.com</h1>
                <p style={{ margin: 0 }}>Order: #{order.id}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', height: 'calc(100% - 70px)' }}>
                <div style={{ width: '48%' }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase' }}>FROM:</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: '0.9rem', margin: '10px 0 0 0' }}>{settings.storeAddress}</pre>
                </div>
                <div style={{ width: '48%' }}>
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase' }}>TO:</h2>
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{order.customer.fullName}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{order.customer.address}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{order.customer.country}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default AdminOrderDetail;