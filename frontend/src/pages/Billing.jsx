import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Receipt, Search, Download, CreditCard, Banknote, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const Billing = () => {
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { socket } = useSocket();

  const fetchUnpaidOrders = async () => {
    try {
      const res = await axios.get('/orders');
      // In a real scenario, we might want orders that are SERVED or COMPLETED but payment is PENDING
      const filtered = res.data.filter(o => o.payment_status === 'PENDING' && o.status !== 'CANCELLED');
      setUnpaidOrders(filtered);
    } catch (error) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidOrders();

    if (socket) {
      socket.on('order_status_update', () => fetchUnpaidOrders());
      socket.on('new_order', () => fetchUnpaidOrders());
    }

    return () => {
      if (socket) {
        socket.off('order_status_update');
        socket.off('new_order');
      }
    };
  }, [socket]);

  const handlePayment = async (method) => {
    if (!selectedOrder) return;
    setProcessingPayment(true);
    try {
      await axios.post(`/orders/${selectedOrder.id}/pay`, {
        payment_method: method,
        amount: selectedOrder.total
      });
      toast.success('Payment processed successfully');
      setSelectedOrder(null);
      fetchUnpaidOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Payment failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Pending Bills List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white mb-2">Pending Bills</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID or Table..." 
            className="input-field pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
          {unpaidOrders.length > 0 ? unpaidOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`glass p-4 rounded-xl cursor-pointer transition-all border ${
                selectedOrder?.id === order.id ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">{order.order_number}</span>
                <span className="text-amber-500 font-bold">${order.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-zinc-400">
                <span>Table {order.table_id || 'N/A'}</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs">{order.status}</span>
              </div>
            </div>
          )) : (
            <div className="text-center p-8 text-zinc-500">
              No pending bills found
            </div>
          )}
        </div>
      </div>

      {/* Bill Details */}
      <div className="flex-1 glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        {selectedOrder ? (
          <>
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-start print:hidden">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Invoice</h3>
                <p className="text-zinc-400">Order: {selectedOrder.order_number}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors" title="Print Receipt">
                  <Printer size={20} />
                </button>
                <button className="p-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors" title="Download PDF">
                  <Download size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-zinc-950 text-white receipt-print-area">
              <div className="text-center mb-8 hidden print:block">
                <h2 className="text-2xl font-bold">ZESTORA</h2>
                <p className="text-sm text-zinc-400">123 Tech Park, Silicon Valley</p>
                <p className="text-sm text-zinc-400">Phone: +1 (555) 123-4567</p>
                <div className="my-4 border-b border-dashed border-zinc-700"></div>
              </div>

              <div className="flex justify-between mb-8 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Billed To:</p>
                  <p className="font-semibold text-white">{selectedOrder.customer_name || 'Walk-in Customer'}</p>
                  <p className="text-zinc-400">Table {selectedOrder.table_id || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 mb-1">Invoice Date:</p>
                  <p className="font-semibold text-white">{new Date().toLocaleDateString()}</p>
                  <p className="text-zinc-400">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <table className="w-full text-left mb-8">
                <thead className="text-xs text-zinc-500 border-b border-white/10 uppercase">
                  <tr>
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium text-center">Qty</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="py-3 text-white">{item.name}</td>
                        <td className="py-3 text-center text-zinc-300">{item.quantity}</td>
                        <td className="py-3 text-right text-zinc-300">${item.price}</td>
                        <td className="py-3 text-right text-white font-medium">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-zinc-500 italic">Items will appear here</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="w-full max-w-sm ml-auto space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Discount</span>
                  <span>-${selectedOrder.discount}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Tax/GST</span>
                  <span>+${selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Service Charge</span>
                  <span>+${selectedOrder.service_charge}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-amber-500">${selectedOrder.total}</span>
                </div>
              </div>
              
              <div className="mt-12 text-center text-zinc-500 text-sm hidden print:block">
                <p>Thank you for dining with us!</p>
                <p>Visit again.</p>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-900/50 print:hidden">
              <h4 className="text-sm font-medium text-zinc-400 mb-4">Select Payment Method</h4>
              <div className="flex gap-4">
                <button 
                  onClick={() => handlePayment('CASH')}
                  disabled={processingPayment}
                  className="flex-1 glass hover:bg-white/5 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border-white/10 hover:border-amber-500/50 group disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Banknote className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white">Cash</span>
                </button>
                <button 
                  onClick={() => handlePayment('CARD')}
                  disabled={processingPayment}
                  className="flex-1 glass hover:bg-white/5 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border-white/10 hover:border-amber-500/50 group disabled:opacity-50 disabled:pointer-events-none"
                >
                  <CreditCard className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white">Card</span>
                </button>
                <button 
                  onClick={() => handlePayment('UPI')}
                  disabled={processingPayment}
                  className="flex-1 glass hover:bg-white/5 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border-white/10 hover:border-amber-500/50 group disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-purple-500 group-hover:scale-110 transition-transform">UPI</div>
                  <span className="font-medium text-white">UPI / QR</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
            <Receipt size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-medium text-zinc-400">No Bill Selected</h2>
            <p className="mt-2 text-sm text-center max-w-sm">Select an order from the list to view its invoice and process payment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
