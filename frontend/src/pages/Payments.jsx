import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CreditCard, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments');
      setPayments(res.data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    p.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-500';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'FAILED': return 'bg-red-500/10 text-red-500';
      case 'REFUNDED': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-zinc-500/10 text-zinc-500';
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Payments</h1>
          <p className="text-zinc-400 text-sm">View transaction history and payment statuses</p>
        </div>
        <button onClick={fetchPayments} className="btn-secondary w-auto flex items-center gap-2">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/5 flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Transaction..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 glass rounded-lg text-zinc-400 hover:text-white border border-white/5">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-zinc-900 z-10">
              <tr className="text-zinc-400 text-sm border-b border-white/5">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-zinc-300">
                      {payment.transaction_id || `TXN-${payment.id.toString().padStart(6, '0')}`}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{payment.order_number}</td>
                    <td className="px-6 py-4 text-zinc-300">{payment.customer_name || 'Guest'}</td>
                    <td className="px-6 py-4 text-amber-500 font-bold">₹{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {format(new Date(payment.created_at), 'MMM dd, h:mm a')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                    <CreditCard size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No payments found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
