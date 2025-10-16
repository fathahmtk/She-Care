import React from 'react';
import { Order } from '../../types';
import Logo from '../Logo';
import CloseIcon from '../icons/CloseIcon';
import PrintIcon from '../icons/PrintIcon';

interface AdminOrderDetailProps {
  order: Order;
  onClose: () => void;
}

const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ order, onClose }) => {
  
  const handlePrint = () => {
    window.print();
  }

  const printStyles = `
    @media print {
        body * {
            visibility: hidden;
        }
        #invoice-content, #invoice-content * {
            visibility: visible;
        }
        #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            font-size: 12px;
            background-color: white !important; /* Ensure invoice background is white for printing */
            color: black !important;
        }
        .print-no-break {
            page-break-inside: avoid;
        }
        .print-text-black {
            color: black !important;
        }
    }
  `;

  return (
    <>
    <style>{printStyles}</style>
    <div 
      className="print:hidden fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-xl font-semibold text-text-primary">Order Details</h2>
          <div>
            <button onClick={handlePrint} className="text-text-secondary hover:text-accent p-2 rounded-md transition-colors mr-2">
                <PrintIcon className="w-5 h-5"/>
            </button>
            <button onClick={onClose} className="text-text-secondary hover:text-accent p-2 rounded-md transition-colors">
                <CloseIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto text-text-primary">
            <div id="invoice-content">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <Logo/>
                        <p className="text-sm text-text-secondary print-text-black mt-2">shecarehub.com</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-2xl font-bold text-text-primary print-text-black">Invoice</h3>
                        <p className="text-text-secondary print-text-black text-sm">Order #{order.id}</p>
                        <p className="text-text-secondary print-text-black text-sm">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 border-t border-border-color pt-4 print-no-break">
                    <div>
                        <h4 className="font-semibold text-text-primary print-text-black mb-1">Billed To:</h4>
                        <p className="text-text-secondary print-text-black">{order.customer.fullName}</p>
                        <p className="text-text-secondary print-text-black">{order.customer.address}</p>
                        <p className="text-text-secondary print-text-black">{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
                        <p className="text-text-secondary print-text-black">{order.customer.country}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-text-primary print-text-black mb-1">Payment Details:</h4>
                        <p className="text-text-secondary print-text-black">Status: <span className="font-semibold text-green-600 dark:text-green-400">Paid</span></p>
                        <p className="text-text-secondary print-text-black">Card: **** **** **** {order.payment.cardNumber.slice(-4)}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="print-no-break">
                    <table className="w-full text-left mb-6">
                        <thead className="border-b border-border-color bg-black/5 dark:bg-white/5">
                            <tr>
                                <th className="p-2 text-sm font-semibold text-text-secondary print-text-black">Item</th>
                                <th className="p-2 text-sm font-semibold text-text-secondary print-text-black text-center">Qty</th>
                                <th className="p-2 text-sm font-semibold text-text-secondary print-text-black text-right">Price</th>
                                <th className="p-2 text-sm font-semibold text-text-secondary print-text-black text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id} className="border-b border-border-color">
                                    <td className="p-2 text-sm text-text-primary print-text-black">{item.name}</td>
                                    <td className="p-2 text-sm text-text-secondary print-text-black text-center">{item.quantity}</td>
                                    <td className="p-2 text-sm text-text-secondary print-text-black text-right">₹{item.price.toFixed(2)}</td>
                                    <td className="p-2 text-sm text-text-primary print-text-black font-semibold text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end print-no-break">
                    <div className="w-full max-w-xs">
                        <div className="flex justify-between text-text-secondary print-text-black">
                            <span>Subtotal</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary print-text-black mb-2">
                            <span>Shipping</span>
                            <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-text-primary print-text-black border-t border-border-color pt-2">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-8 text-sm text-text-secondary print-text-black">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminOrderDetail;