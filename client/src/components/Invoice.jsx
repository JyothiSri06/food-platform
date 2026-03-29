import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Invoice = ({ order, showInUI = false }) => {
  const { settings } = useSettings();
  if (!order) return null;

  const { shipping_address: addr = {} } = order;
  
  // Calculate reliable values
  const subtotal = order.order_items?.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0) || 0;
  const discount = Number(order.discount) || 0;
  const deliveryFee = Number(order.delivery_fee) || (order.total_amount - subtotal + discount);
  const total = Number(order.total_amount);

  // Assuming email might be part of the order object or addr, if not, it will be undefined
  const email = order.email || addr.email;

    const containerClasses = showInUI 
    ? "bg-white p-6 md:p-12 text-[#213C51] font-sans shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto border border-white/20 relative"
    : "print-only bg-white p-12 text-[#213C51] font-sans relative";
  const containerStyle = showInUI ? {} : { minHeight: '29.7cm', width: '21cm', margin: '0 auto' };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Background Watermark/Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -rotate-12">
        <h1 className="text-[120px] font-black uppercase">{settings.business_name || 'JEJI VANTALU'}</h1>
      </div>

      {/* PAID Watermark */}
      {order.payment_status === 'paid' && (
        <div className="absolute top-20 right-20 border-4 border-green-500/30 text-green-500/30 px-6 py-2 rounded-xl rotate-12 font-black text-3xl pointer-events-none uppercase">
          PAID
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-[#213C51] pb-8 mb-10">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 bg-[#E8E2D8] rounded-2xl p-2 flex items-center justify-center shadow-sm border border-[#213C51]/10">
            <img src={settings.logo_url || "/logo.png"} alt={`${settings.business_name || "Jeji Vantalu"} Logo`} className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-1 leading-none text-[#213C51]">{settings.business_name || 'JEJI VANTALU'}</h1>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">{settings.quality_assurance || 'Homemade Delicacies & More'}</p>
            <div className="mt-4 text-[10px] space-y-0.5 font-bold uppercase tracking-wider opacity-60">
              <p className="whitespace-pre-line">{settings.business_address}{settings.address_line_2 ? `, ${settings.address_line_2}` : ''}</p>
              <p>Support: <a href={`tel:${settings.business_phone}`} className="hover:underline transition-all">{settings.business_phone}</a> | <a href={`mailto:${settings.business_email}`} className="hover:underline transition-all">{settings.business_email}</a></p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-[#213C51] text-white px-4 py-1 inline-block mb-3 text-[10px] font-black tracking-[0.2em] uppercase rounded">Tax Invoice</div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-1 opacity-50">Invoice No:</h2>
          <p className="text-lg font-black text-[#213C51] tracking-tight uppercase mb-1">#{order.id}</p>
          <div className="text-[10px] font-bold opacity-60 uppercase">
            <p>Date: {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            <p>Time: {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-20 mb-12">
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-[#213C51]/40 border-b border-[#213C51]/10 pb-1">Sold By</h3>
            <p className="text-base font-black text-[#213C51]">{settings.business_name || 'Jeji Vantalu Kitchen'}</p>
            <p className="text-xs leading-relaxed font-medium opacity-70">
              FSSAI: {settings.fssai_reg || 'N/A'}<br />
              {settings.business_address}<br />
              {settings.address_line_2}
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-[#213C51]/40 border-b border-[#213C51]/10 pb-1">Payment Method</h3>
            <p className="text-xs font-bold uppercase tracking-tight">{order.delivery_method === 'local' ? 'Local Handover' : 'Prepaid Parcel'}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-[#213C51]/40 border-b border-[#213C51]/10 pb-1">Ship To</h3>
          <p className="text-base font-black text-[#213C51]">{addr.firstName} {addr.lastName}</p>
          <div className="text-xs leading-relaxed font-medium opacity-90 mt-1">
            <p>{addr.addressLine1}</p>
            {addr.addressLine2 && <p>{addr.addressLine2}</p>}
            <p>{addr.landmark && `Landmark: ${addr.landmark}, `}{addr.village && `${addr.village}`}</p>
            <p className="font-bold">{addr.city}, {addr.state} - {addr.pincode || addr.postalCode}</p>
            <div className="mt-3 flex items-center space-x-4 pt-2 border-t border-[#213C51]/5">
              <div>
                <span className="text-[8px] font-black uppercase block opacity-40">Mobile</span>
                <span className="font-black text-[#213C51] tracking-wider text-sm">
                  <a href={`tel:${addr.phone}`} className="hover:underline transition-all">{addr.phone}</a>
                </span>
              </div>
              {email && email !== 'undefined' && (
                <div>
                  <span className="text-[8px] font-black uppercase block opacity-40">Email</span>
                  <span className="font-bold lowercase text-[10px]">
                    <a href={`mailto:${email}`} className="hover:underline transition-all">{email}</a>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#213C51] text-white">
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] w-1/2">Product Description</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">Net Wt.</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">Qty</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Rate (₹)</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.order_items?.map((item, idx) => (
              <tr key={idx} className="text-sm group">
                <td className="p-4">
                  <span className="font-black text-[#213C51] block uppercase tracking-tight">{item.name}</span>
                  {item.customization_choices && Object.entries(item.customization_choices).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-x-2">
                       {Object.entries(item.customization_choices).map(([k, v]) => (
                         <span key={k} className="text-[7px] font-black uppercase opacity-60 italic">{k}: {v}</span>
                       ))}
                    </div>
                  )}
                  <span className="text-[8px] font-bold uppercase opacity-30 mt-0.5 block tracking-widest">HSN: 2106 / Pickle & Savories</span>
                </td>
                <td className="p-4 text-center font-bold">{item.weight || 'Std.'}</td>
                <td className="p-4 text-center font-black">{item.quantity}</td>
                <td className="p-4 text-right font-medium opacity-60">₹{Number(item.price).toFixed(2)}</td>
                <td className="p-4 text-right font-black text-[#213C51]">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Container */}
      <div className="flex justify-end pt-4">
        <div className="w-[300px] space-y-4">
          <div className="space-y-1.5 border-b border-[#213C51]/10 pb-4 pr-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="opacity-40 uppercase font-black tracking-widest">Bag Total</span>
              <span className="font-black text-[#213C51]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="opacity-40 uppercase font-black tracking-widest">Shipping Fee</span>
              <span className={deliveryFee > 0 ? "font-black text-[#213C51]" : "font-black text-green-600 uppercase"}>
                 {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs font-bold text-green-600">
                <span className="uppercase font-black tracking-widest opacity-60">Promotion</span>
                <span className="font-black">-₹{discount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center bg-[#213C51] text-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60 mb-0.5">Final Amount</span>
              <span className="text-2xl font-black italic tracking-tighter leading-none">TOTAL DUE</span>
            </div>
            <span className="text-3xl font-black italic tracking-tighter">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="mt-20 border-t-2 border-[#213C51]/10 pt-10">
        <div className="flex justify-between items-start gap-10">
          <div className="flex-1">
            {/* Terms and Conditions Removed as requested */}
          </div>
          <div className="text-center px-12">
             {settings.company_seal_url ? (
               <img src={settings.company_seal_url} alt="Company Seal" className="h-20 w-40 object-contain mb-2 mix-blend-multiply opacity-80" />
             ) : (
               <div className="h-16 w-32 border border-dashed border-[#213C51]/20 flex items-center justify-center opacity-30 mb-2 italic text-[10px]">
                 Company Seal
               </div>
             )}
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Authorized Signatory</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-2">Thank you for craving with us!</p>
          <div className="flex items-center justify-center space-x-6 opacity-30">
             <span className="text-[8px] font-bold uppercase tracking-widest">Computer Generated</span>
             <div className="w-1 h-1 rounded-full bg-[#213C51]"></div>
             <span className="text-[8px] font-bold uppercase tracking-widest">No Signature Required</span>
             <div className="w-1 h-1 rounded-full bg-[#213C51]"></div>
             <span className="text-[8px] font-bold uppercase tracking-widest">{settings.business_name || 'JEJI VANTALU'} v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
