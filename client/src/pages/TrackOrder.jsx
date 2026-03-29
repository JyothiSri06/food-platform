import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, ArrowRight, MessageSquare, Phone, X } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const TrackOrder = () => {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      fetchOrder(id);
    }
  }, [searchParams]);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await api.get(`/orders/track/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrder(orderId.trim());
  };

  const getStatusStep = (status) => {
    const steps = ['processing', 'food prepared', 'shipped', 'delivered'];
    return steps.indexOf(status?.toLowerCase());
  };

  const currentStep = getStatusStep(order?.order_status);
  const stepsCount = 4; // processing, food prepared, shipped, delivered

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-[#213C51] mb-2 tracking-tight">Order Tracking</h1>
        {!order && !loading && !error && (
          <p className="text-gray-500 font-medium italic">Please use the "Track Order" button from your My Orders page to check delivery status.</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl flex items-center gap-4 border border-red-100 animate-shake">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {order && order.order_status === 'cancelled' && (
        <div className="bg-red-50 text-red-700 p-8 rounded-[2.5rem] border border-red-100 mb-8 flex items-center gap-6 animate-in zoom-in-95 duration-500 shadow-sm">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X size={32} />
           </div>
           <div>
              <h2 className="text-xl font-black uppercase tracking-tight">This Order was Cancelled</h2>
              <p className="text-sm font-medium opacity-80 mt-1">This order is no longer being processed. If this was a mistake, please contact support.</p>
           </div>
        </div>
      )}

      {order && order.order_status !== 'cancelled' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status Timeline */}
          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-4">
              {/* Progress Bar Line */}
              <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-[#213C51] transition-all duration-1000 ease-out" 
                  style={{ width: `${currentStep === -1 ? '0%' : (currentStep / (stepsCount - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {[
                { label: 'Processing', icon: Clock, desc: 'Quality checking your items' },
                { label: 'Food Prepared', icon: CheckCircle, desc: 'Your food is ready!' },
                { label: 'Shipped', icon: Truck, desc: 'On the way to your location' },
                { label: 'Delivered', icon: CheckCircle, desc: 'Safely arrived!' }
              ].map((step, idx) => {
                const isCompleted = currentStep >= idx;
                const isCurrent = currentStep === idx;
                
                return (
                  <div key={step.label} className="flex flex-col items-center text-center max-w-[150px]">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                      isCompleted ? 'bg-[#213C51] text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-[#213C51]/20 animate-pulse' : ''}`}>
                      <step.icon size={24} />
                    </div>
                    <span className={`text-sm font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-[#213C51]' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium leading-tight">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Status Updates */}
          {order.status_updates && order.status_updates.length > 0 && (
             <div className="bg-white/60 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-xl">
               <h3 className="text-xs font-black text-[#213C51] uppercase tracking-[0.2em] mb-8 flex items-center">
                 <Clock size={16} className="mr-2" /> Order Progress Details
               </h3>
               <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#213C51]/10">
                 {order.status_updates.slice().reverse().map((update, idx) => (
                   <div key={idx} className="relative pl-10">
                     <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#213C51] flex items-center justify-center shadow-sm">
                       <div className="w-2 h-2 rounded-full bg-[#213C51]" />
                     </div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                       <span className="font-black text-[#213C51] uppercase tracking-tight text-sm">{update.status}</span>
                       <span className="text-[10px] text-gray-400 font-bold bg-[#E8E2D8]/50 px-2 py-1 rounded-md">{new Date(update.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                     </div>
                     <p className="text-gray-600 font-medium text-xs md:text-sm leading-relaxed max-w-2xl">{update.message}</p>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* Order Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#213C51] text-white p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black">#{order.id}</span>
                  <span className="text-sm opacity-60">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between">
                  <span className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Status</span>
                  <span className="font-black uppercase text-[10px] tracking-widest text-[#E8E2D8]">{order.order_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Total Amount</span>
                  <span className="font-black text-xl">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E8E2D8]/40 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/20">
              <h3 className="text-xs font-black text-[#213C51]/60 uppercase tracking-[0.2em] mb-6">Items Included</h3>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-4 scrollbar-hide">
                {order.order_items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[#213C51]/5 last:border-0">
                    <div>
                      <p className="font-bold text-[#213C51] leading-tight">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">Weight: {item.weight} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 bg-[#E8E2D8] px-6 py-3 rounded-2xl border border-white/50 shadow-sm mb-4">
          <MessageSquare size={18} className="text-[#213C51]" />
          <p className="text-[#213C51] font-bold text-sm">
            {settings?.help_message || 'Need help with your order?'}
          </p>
        </div>
        {settings?.support_phone && (
          <div className="flex justify-center items-center gap-2 text-[#213C51] font-black">
            <Phone size={16} />
            <a href={`tel:${settings.support_phone}`} className="hover:underline">{settings.support_phone}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
