import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-[#E8E2D8]/95 backdrop-blur-3xl rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#E8E2D8] rounded-xl text-gray-400 hover:text-gray-900 shadow-md border border-gray-100 hover:rotate-90 transition-all duration-300 z-10"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="p-10 text-center">
          {/* Icon Stage */}
          <div className="w-20 h-20 bg-[#213C51]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative border border-[#213C51]/5">
            <LogIn size={36} className="text-[#213C51]" strokeWidth={2.5} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-[#E8E2D8]">
              <ShieldCheck size={16} className="text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-3xl font-black text-[#213C51] tracking-tighter uppercase leading-[0.9] mb-4">
            Please log in <span className="text-orange-600 italic">to buy</span>
          </h2>
          
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8 leading-relaxed">
            You need to be logged into your account to complete this purchase and enjoy our premium treats.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-3 bg-[#213C51] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl hover:shadow-[#213C51]/30 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-[#213C51]/10"
            >
              <span>Go to Login</span>
              <ArrowRight size={14} strokeWidth={3} />
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-[#213C51]/60 hover:text-[#213C51] transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
