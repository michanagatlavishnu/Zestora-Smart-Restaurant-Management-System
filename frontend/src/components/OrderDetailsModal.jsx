import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle2, ChefHat, Utensils, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { getFoodImage } from '../utils/foodImages';

const TIMELINE_STEPS = [
  { status: 'NEW', label: 'Placed', icon: Clock },
  { status: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { status: 'READY', label: 'Ready', icon: CheckCircle2 },
  { status: 'SERVED', label: 'Served', icon: Utensils },
  { status: 'COMPLETED', label: 'Completed', icon: Receipt },
];

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.status === order.status);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-zinc-900/50 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Order #{order.order_number}</h2>
                <div className="flex gap-4 text-sm text-zinc-400">
                  <span>{order.customer_name || 'Guest'}</span>
                  <span>•</span>
                  <span>Table {order.table_id || 'N/A'}</span>
                  <span>•</span>
                  <span>{format(new Date(order.created_at), 'MMM dd, h:mm a')}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 custom-scrollbar flex-1 space-y-8">
              
              {/* Timeline */}
              <div className="relative flex justify-between items-center mb-8">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 rounded-full z-0 transition-all duration-500"
                  style={{ width: `${currentStepIndex === -1 ? 0 : (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                ></div>
                
                {TIMELINE_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-zinc-900 border-white/10 text-zinc-500'
                      } ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-xs font-medium ${isCompleted ? 'text-amber-500' : 'text-zinc-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <img 
                        src={getFoodImage(item.name) || 'https://via.placeholder.com/100'} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg bg-zinc-900"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100/18181B/F59E0B?text=No+Image'; }}
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{item.menu_item?.name || item.name || 'Unknown Item'}</h4>
                            <p className="text-sm text-zinc-400">Qty: {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}</p>
                            {item.special_instructions && (
                              <p className="text-xs text-amber-500/80 mt-1 flex gap-1">
                                <span className="font-semibold">Note:</span> {item.special_instructions}
                              </p>
                            )}
                          </div>
                          <span className="font-semibold text-white">
                            ₹{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(order.subtotal || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>GST</span><span>₹{Number(order.tax || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Service Charge</span><span>₹{Number(order.service_charge || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-white/10 text-white font-bold text-lg">
                    <span>Total</span><span className="text-amber-500">₹{Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                  <div className="flex-1">
                    <span className="block text-xs text-zinc-500 mb-1">Payment Method</span>
                    <span className="font-medium text-white capitalize">{order.payment_method?.toLowerCase() || 'Not Paid'}</span>
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs text-zinc-500 mb-1">Payment Status</span>
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      order.payment_status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {order.payment_status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
