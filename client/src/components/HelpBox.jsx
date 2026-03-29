import React, { useState } from 'react';
import { MessageSquare, X, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const HelpBox = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  // If no support info is set, we can show a default or hide it
  const supportPhone = settings?.business_phone || '+91 90000 00000';
  const helpMessage = settings?.help_message || 'Need help with your order? Chat with us!';

  const handleWhatsApp = () => {
    const formattedPhone = supportPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${formattedPhone}?text=Hi, I need help with my ${settings.business_name || 'Jeji Vantalu'} order.`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Popup Content */}
      {isOpen && (
        <div className="mb-4 w-72 bg-[#E8E2D8] rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#213C51] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-orange-200" />
              <span className="font-black uppercase tracking-tight text-sm">Customer Help</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-[#213C51] font-bold text-sm leading-relaxed">
              {helpMessage}
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </button>
              

            </div>
          </div>
          
          <div className="bg-[#D9D1C2] p-3 text-center">
             <p className="text-[10px] font-black text-[#213C51]/40 uppercase tracking-widest">Available 9AM - 9PM</p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-orange-500 text-white rotate-90' : 'bg-[#213C51] text-[#E8E2D8] hover:bg-orange-600'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default HelpBox;
