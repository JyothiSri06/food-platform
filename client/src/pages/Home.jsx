import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Truck, ShieldCheck, Clock, Heart, Share2, Tag } from 'lucide-react';
import api from '../services/api';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = React.useContext(WishlistContext);
  const { user } = React.useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  const getProductImage = (url, name) => {
    if (!url) return `https://placehold.co/600x450?text=${encodeURIComponent(name)}`;
    let finalUrl = url.replace('placcholdor', 'placeholder'); // Fix common typo
    if (finalUrl.startsWith('http')) return finalUrl;
    if (finalUrl.startsWith('/')) return finalUrl;
    if (finalUrl.includes('?text=')) return `https://placehold.co/${finalUrl}`;
    return `https://placehold.co/600x450?text=${encodeURIComponent(finalUrl || name)}`;
  };


  const handleShare = (product) => {
    const shareUrl = `${window.location.origin}/products/${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: shareUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // Just take the first 4 for featured
        setFeaturedProducts(res.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#213C51]/20 border-t-[#213C51] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Engine</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-32 lg:pb-36 flex flex-row items-center justify-between gap-4 md:gap-12">
          <div className="flex-grow min-w-0 z-10 relative text-left">
            <h1 className="text-lg sm:text-4xl md:text-6xl tracking-tight font-extrabold text-[#213C51] lg:pr-8 leading-tight sm:leading-[1.1]">
              <span className="block xl:inline">{settings.hero_title || 'From Our Kitchen to Your Cravings'}</span>
            </h1>
            <p className="mt-1 sm:mt-2 max-w-md text-[8px] sm:text-lg text-[#213C51] md:mt-5 md:max-w-3xl lg:mx-0 font-medium leading-relaxed">
              {settings.hero_description || 'Delicious Homemade Foods'}
            </p>
            <div className="mt-4 sm:mt-6 flex flex-row items-center gap-1.5 sm:gap-4 justify-start flex-nowrap">
              <div className="rounded-full shadow-lg shadow-orange-600/20">
                <Link to="/products" className="inline-flex items-center justify-center px-2 sm:px-8 py-1.5 sm:py-4 border border-transparent text-[7px] sm:text-lg font-black uppercase tracking-widest rounded-full text-white bg-orange-600 hover:bg-orange-700 transition duration-150 whitespace-nowrap">
                  Shop Now
                </Link>
              </div>
              <div className="rounded-full shadow-sm">
                <a href="#featured" className="inline-flex items-center justify-center px-2 sm:px-8 py-1.5 sm:py-4 border border-[#213C51]/10 text-[7px] sm:text-lg font-black uppercase tracking-widest rounded-full text-[#213C51] bg-[#E8E2D8]/40 backdrop-blur-sm hover:bg-[#E8E2D8]/60 transition duration-150 whitespace-nowrap">
                  Featured
                </a>
              </div>
            </div>
          </div>
          <div className="w-[140px] sm:w-72 lg:w-[500px] flex-shrink-0 relative">
            <div className="relative w-full rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl transition duration-500 animate-float-mobile lg:animate-float hero-glow">
              {(!settings.hero_video_url || settings.hero_video_url.includes('/video/upload') || settings.hero_video_url.endsWith('.mp4') || settings.hero_video_url.endsWith('.webm')) ? (
                <video 
                  key={settings.hero_video_url} 
                  autoPlay muted loop playsInline 
                  className="w-full h-auto block"
                >
                  <source src={settings.hero_video_url || "/videos/Animated video hero section.mp4"} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={settings.hero_video_url} 
                  alt={settings.hero_title || "Hero Banner"} 
                  className="w-full h-auto block"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 to-transparent mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#213C51]">Featured Products</h2>
            <Link to="/products" className="hidden text-sm font-medium text-[#213C51] hover:text-[#39465D] transition-colors flex items-center space-x-1 group/link font-bold bg-[#E8E2D8] border border-[#213C51]/20 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md">
              Browse all products <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-[#E8E2D8]/90 backdrop-blur-md shadow-inner shadow-[#213C51]/5 border border-[#213C51]/10 rounded-3xl overflow-hidden group">
                  <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
                    <img
                      src={getProductImage(product.image_url, product.name)}
                      alt={product.name}
                      className="object-cover w-full h-40 md:h-64 transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Sale Badge */}
                    {product.discount_percentage > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-orange-600 text-white text-[10px] md:text-xs font-black px-2 md:px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
                          <Tag size={12} className="mr-1" />
                          <span>{product.discount_percentage}% OFF</span>
                        </div>
                      </div>
                    )}

                    {/* Action Bar (Top Right) */}
                    <div className="absolute top-3 right-3 flex flex-col items-center space-y-2 z-10">
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="p-2 bg-[#E8E2D8]/60 backdrop-blur-md shadow-lg shadow-[#213C51]/20 transition-all hover:scale-110 active:scale-90 border border-[#213C51]/10"
                      >
                        <Heart
                          size={14}
                          className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-[#213C51]"}
                          strokeWidth={2.5}
                        />
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShare(product);
                        }}
                        className="p-2 bg-[#E8E2D8]/60 backdrop-blur-md shadow-lg shadow-[#213C51]/20 transition-all hover:scale-110 active:scale-90 border border-[#213C51]/10 text-[#213C51]"
                      >
                        <Share2 size={14} strokeWidth={2.5} />
                      </button>

                      {/* Veg/Non-Veg Symbol */}
                      <div className="p-1.5 bg-[#E8E2D8]/60 backdrop-blur-md shadow-lg shadow-[#213C51]/20 flex items-center justify-center border border-[#213C51]/10">
                        <span className={`w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-gray-100 flex items-center justify-center p-0.5 rounded-sm bg-white`}>
                          <div className={`w-full h-full rounded-full ${product.food_type === 'non-veg' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 md:p-6">
                    <h3 className="text-xs md:text-lg font-bold text-[#213C51] mb-1 truncate">{product.name}</h3>
                    <p className="text-[10px] md:text-sm text-[#213C51]/60 mb-2 md:mb-4 line-clamp-2 leading-relaxed h-8 md:h-10 overflow-hidden">{product.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Starts from</span>
                        <div className="flex items-center space-x-2">
                          {product.discount_percentage > 0 ? (
                            <>
                              <span className="text-sm md:text-xl font-black text-orange-600">
                                ₹{((parseFloat(product.price_250g) || product.price) * (1 - product.discount_percentage / 100)).toFixed(0)}
                              </span>
                              <span className="text-[10px] md:text-sm text-gray-400 line-through">
                                ₹{parseFloat(product.price_250g) || product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm md:text-xl font-black text-[#213C51]">
                              ₹{parseFloat(product.price_250g) || product.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/products/${product.id}`} className="text-[9px] md:text-sm font-black uppercase tracking-tighter text-[#213C51] hover:bg-[#213C51]/5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-full transition-colors border border-[#213C51]/20 text-center">
                          Details
                        </Link>
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="text-[9px] md:text-sm font-black uppercase tracking-tighter bg-[#213C51] text-white px-3 md:px-5 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#213C51]/20 hover:bg-[#39465D] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link to="/products" className="block text-sm font-medium text-orange-600 hover:text-orange-500 text-center">
              Browse all products <ChevronRight size={16} className="inline ml-1 mb-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <LoginPromptModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Home;
