import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Heart, ArrowRight, ChevronRight } from 'lucide-react';
import LoginPromptModal from '../components/LoginPromptModal';


const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        <div className="bg-[#E8E2D8]/60 backdrop-blur-md p-12 md:p-20 rounded-[3rem] shadow-xl border border-white/20 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#E8E2D8]/30 rounded-full flex items-center justify-center mb-8 border border-dashed border-[#213C51]/20">
            <Heart size={40} className="text-gray-200" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-400 font-medium max-w-md mx-auto mb-10 text-sm md:text-base uppercase tracking-widest leading-relaxed">
            Save your favorite treats to see them here later and quickly add them to your cart.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center space-x-3 bg-[#213C51] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-[#213C51]/30 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-[#213C51]/20"
          >
            <span>Explore Collection</span>
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-[2px] bg-[#213C51]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#213C51]">Personal Collection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">Your <span className="text-[#213C51] italic">Wishlist</span></h1>
        </div>
        <p className="text-[10px] md:text-sm text-gray-400 font-black uppercase tracking-[0.3em] mb-1">
          {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group bg-[#E8E2D8]/90 backdrop-blur-md rounded-[2.5rem] border border-[#213C51]/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#213C51]/5">
              <Link to={`/products/${product.id}`} className="block w-full h-full">
                <img
                  src={product.image_url || `https://via.placeholder.com/600x450?text=${product.name}`}
                  alt={product.name}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                />
              </Link>

              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-2.5 bg-white rounded-xl shadow-lg text-[#213C51] hover:bg-red-50 transition-all z-10"
                title="Remove from Wishlist"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>

              <div className="absolute top-4 left-4">
                <span className={`w-4 h-4 md:w-5 md:h-5 border-2 border-gray-100 flex items-center justify-center p-0.5 rounded-sm bg-[#E8E2D8]/95 backdrop-blur-md shadow-sm`}>
                  <div className={`w-full h-full rounded-full ${product.food_type === 'non-veg' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                </span>
              </div>
              
              {!product.is_available && (
                <div className="absolute inset-0 bg-[#E8E2D8]/70 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/30">Currently Offline</span>
                </div>
              )}
            </div>

            <div className="p-4 md:p-7 flex flex-col flex-grow">
              <div className="mb-4">
                <Link to={`/products/${product.id}`} className="block">
                  <span className="text-[8px] md:text-[9px] font-black text-[#213C51]/40 uppercase tracking-[0.3em] block mb-1">{product.category}</span>
                  <h3 className="text-sm md:text-xl font-black text-gray-900 leading-[1.1] transition-colors group-hover:text-[#213C51] line-clamp-1 mb-2">{product.name}</h3>
                </Link>
                <span className="text-base md:text-xl font-black text-gray-900 tracking-tighter italic block">₹{parseFloat(product.price_250g) || product.price}</span>
              </div>

              <div className="mt-auto pt-4 md:pt-6 border-t border-gray-50 flex items-center justify-between">
                <Link 
                  to={`/products/${product.id}`}
                  className="text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </Link>

                <button 
                  onClick={() => {
                    if (product.is_available) {
                      if (!user) {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      addToCart(product, '250g', parseFloat(product.price_250g) || product.price);
                    }
                  }}

                  className={`bg-[#213C51] text-white p-3 rounded-2xl shadow-lg shadow-[#213C51]/20 hover:shadow-xl transition-all active:scale-95 ${!product.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!product.is_available}
                  title="Add to Cart"
                >
                  <ShoppingBag size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <LoginPromptModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Wishlist;
