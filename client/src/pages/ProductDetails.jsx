import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, ChevronRight, ShoppingBag, Banknote, Share2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import LoginPromptModal from '../components/LoginPromptModal';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getProductImage = (url, name) => {
    if (!url) return `https://placehold.co/800x800?text=${encodeURIComponent(name)}`;
    let finalUrl = url.replace('placcholdor', 'placeholder'); // Fix common typo
    if (finalUrl.startsWith('http')) return finalUrl;
    if (finalUrl.startsWith('/')) return finalUrl;
    if (finalUrl.includes('?text=')) return `https://placehold.co/${finalUrl}`;
    return `https://placehold.co/800x800?text=${encodeURIComponent(finalUrl || name)}`;
  };

  const formatCategory = (category) => {
    if (!category) return '';
    return category
      .split(',')
      .map(c => c.trim())
      .filter(c => c.toUpperCase() !== 'ALL PRODUCTS')
      .join(', ');
  };


  const getAvailableWeights = (item) => {
    if (!item) return [];
    const weights = [];
    if (item.available_250g !== false) weights.push('250g');
    if (item.available_500g !== false) weights.push('500g');
    if (item.available_1kg !== false) weights.push('1kg');
    return weights;
  };

  const getOriginalPriceForWeight = () => {
    if (!product) return 0;
    const available = getAvailableWeights(product);
    const weight = selectedWeight || (available.length > 0 ? available[0] : '250g');
    const basePrice = parseFloat(product.price) || 0;
    const p250 = parseFloat(product.price_250g);
    const p500 = parseFloat(product.price_500g);
    const p1kg = parseFloat(product.price_1kg);
    
    if (weight === '250g') return p250 || basePrice;
    if (weight === '500g') return (p500 && p500 !== basePrice) ? p500 : Math.round(basePrice * 1.8);
    if (weight === '1kg') return (p1kg && p1kg !== basePrice) ? p1kg : Math.round(basePrice * 3.5);
    
    return basePrice;
  };

  const getPriceForWeight = () => {
    const originalPrice = getOriginalPriceForWeight();
    if (product?.discount_percentage > 0) {
      return Math.round(originalPrice * (1 - product.discount_percentage / 100));
    }
    return originalPrice;
  };

  useEffect(() => {
    const fetchProductAndSuggestions = async () => {
      setLoading(true);
      try {
        const [productRes, allProductsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products')
        ]);
        
        const currentProduct = productRes.data;
        setProduct(currentProduct);
        
        // Removed auto-select weight to force user choice
        
        // Filter suggestions...
        if (currentProduct) {
          const currentCat = (currentProduct.category || '').trim().toLowerCase();
          let suggestions = allProductsRes.data
            .filter(p => {
              const pCat = (p.category || '').trim().toLowerCase();
              return pCat === currentCat && p.id !== currentProduct.id;
            });

          // Fallback: If not enough matches in same category, add other products
          if (suggestions.length < 4) {
            const others = allProductsRes.data
              .filter(p => p.id !== currentProduct.id && !suggestions.find(s => s.id === p.id))
              .sort(() => 0.5 - Math.random());
            suggestions = [...suggestions, ...others].slice(0, 4);
          } else {
            suggestions = suggestions.slice(0, 4);
          }
          
          setSuggestedProducts(suggestions);
        }
      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndSuggestions();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!selectedWeight) {
      alert('Please select a weight/quantity before adding to cart');
      return;
    }
    if (product) {

      const price = getPriceForWeight();
      for(let i=0; i<quantity; i++) {
        addToCart(product, selectedWeight, price);
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!selectedWeight) {
      alert('Please select a weight/quantity before buying');
      return;
    }
    if (product) {

      const price = getPriceForWeight();
      const buyNowItem = {
        cartId: `buynow-${product.id}-${selectedWeight}`,
        product_id: product.id,
        name: product.name,
        price: price,
        weight: selectedWeight,
        quantity: quantity,
        image_url: product.image_url,
        product_type: product.product_type,
        customization_ids: product.customization_ids || []
      };
      navigate('/checkout', { state: { buyNowItem } });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-[#213C51] mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12 max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/products')} 
          className="group flex items-center space-x-3 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#213C51]/60 hover:text-[#213C51] transition-all"
        >
          <div className="p-2 md:p-3 bg-[#E8E2D8]/60 backdrop-blur-md rounded-xl shadow-lg shadow-black/5 group-hover:-translate-x-1 transition-transform border border-[#213C51]/10">
            <ArrowLeft size={16} strokeWidth={3} />
          </div>
          <span className="hidden sm:inline">Return to Menu</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="h-[1px] w-8 md:w-16 bg-[#213C51]/20"></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#213C51]">Detail View</span>
        </div>
      </div>

      {/* Main Product Stage */}
      <div className="relative mb-20 md:mb-32 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center">
          
          {/* Visual Showcase - Product Image */}
          <div className="relative z-10 w-full">
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 transition-transform duration-700 hover:scale-[1.01]">
              <img 
                src={getProductImage(product.image_url, product.name)} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.discount_percentage > 0 && (
                      <div className="bg-orange-600/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl shadow-orange-600/30 flex items-center space-x-2 border border-orange-500/20 animate-bounce-slow">
                        <Tag size={12} className="text-white animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{product.discount_percentage}% SPECIAL OFF</span>
                      </div>
                    )}
                  </div>

              {/* Action Bar (Top Right) */}
              <div className="absolute top-6 right-6 flex flex-col items-center space-y-3 z-10">
                {/* Wishlist Button */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 bg-[#E8E2D8]/95 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 ${isInWishlist(product.id) ? 'text-red-500' : 'text-[#213C51]'}`}
                >
                  <Heart size={20} className={isInWishlist(product.id) ? "fill-red-500" : ""} strokeWidth={2.5} />
                </button>

                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className="p-3 bg-[#E8E2D8]/95 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 text-[#213C51]"
                  title="Share Product"
                >
                  <Share2 size={20} strokeWidth={2.5} />
                </button>

                {/* Veg/Non-Veg Symbol */}
                <div className="p-2 bg-[#E8E2D8] backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center">
                  <span className={`w-5 h-5 md:w-6 md:h-6 border-2 border-[#E8E2D8] flex items-center justify-center p-0.5 rounded-sm bg-[#E8E2D8] shadow-sm`}>
                    <div className={`w-full h-full rounded-full ${product.food_type === 'non-veg' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                  </span>
                </div>
              </div>

              {!product.is_available && (
                <div className="absolute inset-0 bg-[#E8E2D8]/40 backdrop-blur-md flex items-center justify-center">
                  <div className="bg-[#E8E2D8]/90 px-8 py-3 rounded-2xl shadow-2xl border border-red-100 flex flex-col items-center">
                    <span className="text-red-600 font-black text-xs uppercase tracking-[0.4em] mb-1">Stock Empty</span>
                    <span className="text-[9px] text-[#213C51] font-bold uppercase tracking-widest">Check back soon</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Intel - Details Card */}
          <div className="z-20 w-full mt-[-3rem] lg:mt-0">
            <div className="bg-[#E8E2D8]/85 backdrop-blur-2xl p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-white/50 transition-all duration-500 hover:shadow-2xl">
              
              <div className="flex flex-col mb-4 md:mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-[8px] md:text-[9px] font-black text-[#213C51] uppercase tracking-[0.4em]">{formatCategory(product.category)}</span>
                  <div className="flex-1 h-[1px] bg-[#213C51]/10"></div>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-[#213C51] tracking-tighter leading-[0.85] mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  {product.discount_percentage > 0 ? (
                    <>
                      <span className="text-xl md:text-2xl font-black text-orange-600 tracking-tighter italic">₹{getPriceForWeight()}</span>
                      <span className="text-lg md:text-xl text-gray-400 line-through font-bold opacity-60">₹{getOriginalPriceForWeight()}</span>
                    </>
                  ) : (
                    <span className="text-xl md:text-2xl font-black text-[#213C51] tracking-tighter italic">₹{getPriceForWeight()}</span>
                  )}
                </div>
              </div>

              <p className="text-[#213C51] text-sm md:text-base font-medium mb-10 leading-relaxed max-w-sm">
                {product.description}
              </p>

              <div className="space-y-6 md:space-y-8">
                {/* Interaction Group */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center bg-[#E8E2D8]/50 rounded-xl p-0.5 border border-[#E8E2D8]">
                      <button 
                        onClick={decreaseQuantity}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-[#213C51] hover:text-[#213C51] font-black text-base transition-all hover:bg-[#E8E2D8] rounded-lg shadow-sm"
                        disabled={!product.is_available}
                      >-</button>
                      <span className="w-8 md:w-12 text-center font-black text-base md:text-lg text-[#213C51] tracking-tighter leading-none">{quantity}</span>
                      <button 
                        onClick={increaseQuantity}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-[#213C51] hover:text-[#213C51] font-black text-base transition-all hover:bg-[#E8E2D8] rounded-lg shadow-sm"
                        disabled={!product.is_available}
                      >+</button>
                    </div>
                  </div>

                  {/* Weight Selector */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-[#213C51] uppercase tracking-widest block">Choose Quantity / Weight</span>
                    <div className="flex gap-2">
                      {getAvailableWeights(product).map((w) => (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          disabled={!product.is_available}
                          className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            selectedWeight === w 
                              ? 'bg-[#213C51] text-white border-[#213C51] shadow-lg shadow-[#213C51]/20 scale-100' 
                              : 'bg-[#E8E2D8] text-[#213C51] border-gray-100 hover:border-gray-300 hover:text-gray-600'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                      {getAvailableWeights(product).length === 0 && (
                        <div className="w-full py-3 text-center bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-xl border border-red-100 italic">
                          No quantities available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.is_available || isAdded}
                    className={`flex-1 flex items-center justify-center px-2 md:px-4 py-3 md:py-4 rounded-[1rem] md:rounded-[1.2rem] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                      isAdded 
                        ? 'bg-green-100 text-green-700'
                        : product.is_available 
                          ? 'bg-[#213C51]/10 text-[#213C51] hover:bg-[#213C51]/20 active:scale-95' 
                          : 'bg-gray-100 text-[#213C51] cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="mr-1.5 md:mr-2" size={14} strokeWidth={3} />
                    {isAdded ? 'Added ✓' : 'Add to Cart'}
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    disabled={!product.is_available}
                    className={`flex-1 flex items-center justify-center px-3 md:px-5 py-3 md:py-4 rounded-[1rem] md:rounded-[1.2rem] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all ${
                      product.is_available 
                        ? 'bg-[#213C51] hover:bg-[#39465D] shadow-[#213C51]/40 hover:-translate-y-1 active:scale-95' 
                        : 'bg-gray-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Section - "You May Also Like" */}
      {suggestedProducts.length > 0 && (
        <div className="pt-20 border-t border-[#213C51]/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-[2px] bg-[#213C51]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#213C51]">Curated Discovery</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#213C51] tracking-tighter uppercase">You May Also <span className="text-[#213C51] italic">Like</span></h2>
            </div>
            <Link to="/products" className="group flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#213C51]/60 hover:text-[#213C51] transition-all pb-1 border-b-2 border-transparent hover:border-[#213C51]/20">
              View All Collection <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {suggestedProducts.map((p) => (
              <div key={p.id} className="group flex flex-col items-center">
                <Link to={`/products/${p.id}`} className="block relative w-full aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl shadow-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-[#213C51]/10 hover:-translate-y-2 mb-6">
                  <img
                    src={getProductImage(p.image_url, p.name)}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
                <div className="text-center w-full px-2">
                  <span className="text-[8px] md:text-[10px] font-black text-[#213C51]/40 uppercase tracking-[0.3em] block mb-1">{p.category}</span>
                  <h3 className="text-xs md:text-lg font-black text-[#213C51] tracking-tight transition-colors group-hover:text-[#213C51] truncate mb-3">{p.name}</h3>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-base md:text-xl font-black text-[#213C51] tracking-tighter italic leading-none">₹{p.price}</span>
                    <button 
                      onClick={() => {
                        if (!user) {
                          setIsLoginModalOpen(true);
                          return;
                        }
                        addToCart(p);
                      }}

                      className="w-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#213C51] bg-[#213C51]/5 hover:bg-[#213C51] hover:text-white py-3 md:py-4 rounded-xl md:rounded-2xl transition-all border border-[#213C51]/10"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <LoginPromptModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default ProductDetails;
