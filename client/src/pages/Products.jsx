import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter, ArrowRight, ChevronRight, ChevronDown, Search, Layout, X, Heart, Share2, Tag } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../components/LoginPromptModal';


const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialCategory);
  
  // States for Search & Inline Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeights, setSelectedWeights] = useState({});
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getProductImage = (url, name) => {
    if (!url) return `https://placehold.co/600x450?text=${encodeURIComponent(name)}`;
    let finalUrl = url.replace('placcholdor', 'placeholder'); // Fix common typo
    if (finalUrl.startsWith('http')) return finalUrl;
    if (finalUrl.startsWith('/')) return finalUrl;
    if (finalUrl.includes('?text=')) return `https://placehold.co/${finalUrl}`;
    return `https://placehold.co/600x450?text=${encodeURIComponent(finalUrl || name)}`;
  };

  const getAvailableWeights = (product) => {
    const weights = [];
    if (product.available_250g !== false) weights.push('250g');
    if (product.available_500g !== false) weights.push('500g');
    if (product.available_1kg !== false) weights.push('1kg');
    return weights;
  };

  const getOriginalWeightPrice = (product) => {
    const available = getAvailableWeights(product);
    const weight = selectedWeights[product.id] || (available.length > 0 ? available[0] : '250g');
    const basePrice = parseFloat(product.price) || 0;
    const p250 = parseFloat(product.price_250g);
    const p500 = parseFloat(product.price_500g);
    const p1kg = parseFloat(product.price_1kg);
    
    if (weight === '250g') return p250 || basePrice;
    if (weight === '500g') return (p500 && p500 !== basePrice) ? p500 : Math.round(basePrice * 1.8);
    if (weight === '1kg') return (p1kg && p1kg !== basePrice) ? p1kg : Math.round(basePrice * 3.5);
    
    return basePrice;
  };

  const getWeightPrice = (product) => {
    const originalPrice = getOriginalWeightPrice(product);
    if (product.discount_percentage > 0) {
      return Math.round(originalPrice * (1 - product.discount_percentage / 100));
    }
    return originalPrice;
  };

  const [activeDropdown, setActiveDropdown] = useState(null); // 'diet', 'type', 'sort'
  const [advancedFilters, setAdvancedFilters] = useState({
    diet: 'all',
    type: 'all',
    sort: 'newest'
  });

  // Sync filter state from URL on initial load or searchParams change
  useEffect(() => {
    const categoryFromURL = searchParams.get('category') || 'all';
    if (categoryFromURL !== filter) {
      setFilter(categoryFromURL);
    }
  }, [searchParams]);

  // Unified filter change handler to avoid infinite loops
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const newParams = new URLSearchParams(searchParams);
    if (newFilter === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', newFilter.toLowerCase());
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    const matchesCategory = filter === 'all' || (p.category && p.category.split(',').map(c => c.trim().toLowerCase()).includes(filter.toLowerCase()));
    
    // 2. Search Filter
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 3. Diet Filter
    const matchesDiet = advancedFilters.diet === 'all' || (p.food_type || 'veg') === advancedFilters.diet;
    
    // 4. Product Type Filter
    const matchesType = advancedFilters.type === 'all' || (p.product_type || 'fresh') === advancedFilters.type;
    
    return matchesCategory && matchesSearch && matchesDiet && matchesType;
  }).sort((a, b) => {
    if (advancedFilters.sort === 'price-low') return a.price - b.price;
    if (advancedFilters.sort === 'price-high') return b.price - a.price;
    return new Date(b.created_at) - new Date(a.created_at);
  });

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

  const activeFilterCount = (advancedFilters.diet !== 'all' ? 1 : 0) + 
                             (advancedFilters.type !== 'all' ? 1 : 0) + 
                             (advancedFilters.sort !== 'newest' ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Reduced spacing */}
      <div className="relative overflow-hidden pt-6 pb-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#213C51] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#213C51] rounded-full blur-[120px]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-20">
        {/* Dynamic Category Section */}
        <div className="animate-in fade-in slide-in-from-top duration-700">
          {/* Compact Header Mode - Persistent */}
          <div className="flex items-center space-x-6 md:space-x-8 mb-4 md:mb-8 overflow-x-auto pb-4 md:pb-6 scrollbar-hide px-2 md:px-4">
            <button
              onClick={() => handleFilterChange('all')}
              className="flex flex-col items-center justify-center flex-shrink-0 group"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-1.5 md:mb-2 transition-all ${filter === 'all' ? 'border-[2px] md:border-[3px] border-[#213C51] ring-2 md:ring-4 ring-[#213C51]/10' : 'border border-transparent group-hover:border-[#213C51]/20'}`}>
                <ShoppingBag size={20} className="md:size-24 text-[#213C51]" />
              </div>
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors ${filter === 'all' ? 'text-[#213C51]' : 'text-[#213C51] group-hover:text-[#213C51]'}`}>All</span>
            </button>

              {categories
                .filter(cat => cat.name.toLowerCase() !== 'all products' && cat.name.toLowerCase() !== 'all creations')
                .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.name)}
                  className="flex flex-col items-center justify-center flex-shrink-0 group"
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-1.5 md:mb-2 overflow-hidden transition-all ${filter === cat.name ? 'border-[2px] md:border-[3px] border-[#213C51] ring-2 md:ring-4 ring-[#213C51]/10' : 'border border-transparent group-hover:border-[#213C51]/20'}`}>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layout size={16} className="md:size-10 text-gray-200" />
                    )}
                  </div>
                  <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors ${filter === cat.name ? 'text-[#213C51]' : 'text-[#213C51] group-hover:text-[#213C51]'}`}>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Active Category Banner with Filter Button - FORCED SAME LINE ON MOBILE */}
            <div className="flex flex-row items-center justify-between mb-4 md:mb-12 px-1 md:px-4 gap-2">
              <div className="bg-[#213C51] text-white px-3 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl shadow-xl shadow-[#213C51]/20 flex items-center space-x-3 w-auto justify-start transform transition-transform hover:scale-[1.02] flex-shrink-0">
                <span className="text-[10px] md:text-xl font-black tracking-tight uppercase whitespace-nowrap">{filter}</span>
              </div>
              
              {/* Action Buttons Group (Right side) */}
              <div className="flex items-center justify-end space-x-1.5 md:space-x-4 w-auto ml-auto">
                {/* Persistent External Clear - Moved to left of Filter for stability */}
                {(activeFilterCount > 0 || searchQuery) && (
                  <button 
                    onClick={() => {
                      setAdvancedFilters({ diet: 'all', type: 'all', sort: 'newest' });
                      setSearchQuery('');
                      setActiveDropdown(null);
                    }}
                    className="group flex items-center space-x-2 px-3 md:px-6 py-2 md:py-3.5 text-[#213C51] font-black text-[8px] md:text-[10px] uppercase tracking-widest bg-[#E8E2D8] shadow-inner shadow-[#213C51]/5 border-[#213C51]/20 rounded-xl md:rounded-3xl transition-all duration-500 animate-in fade-in slide-in-from-right-4 duration-500 flex-shrink-0"
                  >
                    <div className="p-1 md:p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:border-[#213C51]/30 transition-all">
                      <X size={10} md:size={12} strokeWidth={3} />
                    </div>
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}

                {/* Premium Unified Filter Button */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'unified' ? null : 'unified')}
                    className={`group flex items-center space-x-2 md:space-x-3 px-3 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-3xl border transition-all duration-500 ${activeFilterCount > 0 ? 'bg-[#213C51] text-white border-[#213C51] shadow-[0_20px_40px_rgba(158,63,90,0.3)]' : 'bg-[#E8E2D8]/90 backdrop-blur-md border-gray-100 text-gray-700 hover:border-[#213C51]/30 hover:shadow-xl hover:shadow-black/5'}`}
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className={`p-1 md:p-1.5 rounded-lg transition-colors ${activeFilterCount > 0 ? 'bg-[#E8E2D8]/30' : 'bg-[#213C51]/5 text-[#213C51]'}`}>
                        <Filter size={12} md:size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.14em] whitespace-nowrap">
                        {activeFilterCount > 0 ? `(${activeFilterCount})` : 'Refine'}
                      </span>
                    </div>
                    <ChevronDown size={10} md:size={14} className={`transition-transform duration-500 ${activeDropdown === 'unified' ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                  </button>

                {activeDropdown === 'unified' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)}></div>
                    <div className="absolute top-[120%] right-0 mt-2 w-[calc(100vw-32px)] md:w-64 bg-[#E8E2D8]/98 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-white/50 z-40 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-300 origin-top-right">
                      <div className="p-4 space-y-4">
                        
                        {/* Segmented Control - Category Preference */}
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-[#213C51]">Category</h4>
                            {filter !== 'all' && <div className="w-1.5 h-1.5 rounded-full bg-[#213C51] animate-pulse"></div>}
                          </div>
                          
                          <select
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-2 text-[10px] font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51]/50 transition-all appearance-none cursor-pointer"
                          >
                            <option value="all">ALL CATEGORIES</option>
                            {categories
                              .filter(cat => cat.name.toLowerCase() !== 'all products' && cat.name.toLowerCase() !== 'all creations')
                              .map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                  {cat.name.toUpperCase()}
                                </option>
                            ))}
                          </select>
                        </div>

                        {/* Minimalist Separator */}
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

                        {/* Segmented Control - Dietary Preference */}
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-[#213C51]">Dietary Style</h4>
                            {advancedFilters.diet !== 'all' && <div className="w-1.5 h-1.5 rounded-full bg-[#213C51] animate-pulse"></div>}
                          </div>
                          
                          <select
                            value={advancedFilters.diet}
                            onChange={(e) => setAdvancedFilters(prev => ({...prev, diet: e.target.value}))}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-2 text-[10px] font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51]/50 transition-all appearance-none cursor-pointer"
                          >
                            <option value="all">ALL DIETS</option>
                            <option value="veg">VEGETARIAN</option>
                            <option value="non-veg">NON-VEGETARIAN</option>
                          </select>
                        </div>

                        {/* Minimalist Separator */}
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

                        {/* Segmented Control - Method */}
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-[#213C51]">Delivery Type</h4>
                            {advancedFilters.type !== 'all' && <div className="w-1.5 h-1.5 rounded-full bg-[#213C51] animate-pulse"></div>}
                          </div>
                          
                          <select
                            value={advancedFilters.type}
                            onChange={(e) => setAdvancedFilters(prev => ({...prev, type: e.target.value}))}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-2 text-[10px] font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51]/50 transition-all appearance-none cursor-pointer"
                          >
                            <option value="all">ALL OPTIONS</option>
                            <option value="fresh">LOCAL DELIVERY</option>
                            <option value="packaged">PAN INDIA DELIVERY</option>
                          </select>
                        </div>

                        {/* Subtle Sort Section */}
                        <div className="pt-2">
                           <div className="flex gap-2">
                              {[
                                { id: 'newest', label: 'Latest' },
                                { id: 'price-low', label: 'Price ↓' },
                                { id: 'price-high', label: 'Price ↑' }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => setAdvancedFilters(prev => ({...prev, sort: option.id}))}
                                  className={`flex-1 py-2 px-1 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                    advancedFilters.sort === option.id
                                      ? 'border-[#213C51]/20 bg-[#213C51]/5 text-[#213C51]'
                                      : 'border-transparent bg-gray-50 text-[#213C51] hover:bg-gray-100 hover:text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                           </div>
                        </div>
                      </div>
                      
                      {/* Premium Action Footer */}
                      <div className="p-4 bg-gray-50/50 border-t border-gray-100/50">
                        <button 
                          onClick={() => setActiveDropdown(null)}
                          className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5"
                        >
                          Apply Refinements
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h2 className="text-lg md:text-3xl font-black text-[#213C51] tracking-tighter uppercase mb-1 md:mb-2">
              Our <span className="text-[#213C51]">{filter === 'all' ? 'Full' : filter}</span> Collection
            </h2>
            <div className="flex items-center space-x-2">
              <div className="h-0.5 md:h-1 w-8 md:w-10 bg-[#213C51] rounded-full"></div>
              <p className="text-[10px] md:text-sm text-[#213C51] font-bold uppercase tracking-widest">Showing {filteredProducts.length} Premium Items</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#213C51] transition-colors" size={14} md:size={16} />
              <input 
                type="text" 
                placeholder="Search kitchen..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-100 rounded-xl md:rounded-2xl py-2 md:py-3.5 pl-10 md:pl-11 pr-10 md:pr-6 text-xs md:text-sm outline-none focus:ring-4 focus:ring-[#213C51]/5 focus:border-[#213C51] transition-all w-full md:min-w-[280px] font-medium" 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#213C51]"
                >
                  <X size={12} md:size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-[#E8E2D8]/30 rounded-[2.5rem] h-[420px] animate-pulse border border-[#213C51]/10"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-[#E8E2D8]/30 backdrop-blur-sm rounded-[3rem] border border-dashed border-[#213C51]/20">
            <ShoppingBag size={64} className="mx-auto text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-[#213C51] tracking-tight">No match found</h3>
            <p className="mt-2 text-[#213C51] font-medium max-w-sm mx-auto uppercase tracking-tighter text-sm">We're constantly crafting new recipes. Check back soon!</p>
            <button 
              onClick={() => {
                handleFilterChange('all');
                setSearchQuery('');
                setAdvancedFilters({ diet: 'all', type: 'all', sort: 'newest' });
              }} 
              className="mt-8 text-[#213C51] font-black uppercase tracking-[0.2em] text-xs hover:underline decoration-2 underline-offset-8"
            >
              Reveal All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-32">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-[#E8E2D8]/90 backdrop-blur-md rounded-[2.5rem] border border-[#213C51]/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <img
                    src={getProductImage(product.image_url, product.name)}
                    alt={product.name}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Sale Badge */}
                  {product.discount_percentage > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-orange-600 text-white text-[10px] md:text-sm font-black px-3 md:px-4 py-1.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce-slow">
                        <Tag size={14} className="animate-pulse" />
                        <span>{product.discount_percentage}% OFF</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-[#E8E2D8]/95 backdrop-blur-md p-3 rounded-2xl shadow-xl text-[#213C51]">
                      <ArrowRight size={20} />
                    </div>
                  </div>

                  {/* Action Bar (Top Right) */}
                  <div className="absolute top-4 right-4 flex flex-col items-center space-y-2 z-10">
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="p-2.5 bg-[#E8E2D8]/98 backdrop-blur-md rounded-xl shadow-lg transition-all hover:scale-110 active:scale-90"
                    >
                      <Heart 
                        size={16} 
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
                      className="p-2.5 bg-[#E8E2D8]/98 backdrop-blur-md rounded-xl shadow-lg transition-all hover:scale-110 active:scale-90 text-[#213C51]"
                    >
                      <Share2 size={16} strokeWidth={2.5} />
                    </button>

                    {/* Veg/Non-Veg Symbol */}
                    <div className="p-2 bg-[#E8E2D8]/98 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center">
                      <span className={`w-4 h-4 md:w-5 md:h-5 border-2 border-gray-100 flex items-center justify-center p-0.5 rounded-sm bg-white`}>
                        <div className={`w-full h-full rounded-full ${product.food_type === 'non-veg' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-7 flex flex-col flex-grow relative">
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="flex flex-col">
                      <h3 className="text-sm md:text-xl font-black text-[#213C51] leading-[1.1] group-hover:text-[#213C51] transition-colors line-clamp-1">{product.name}</h3>
                    </div>
                  </div>

                  <p className="hidden md:block text-[10px] text-[#213C51] font-medium line-clamp-1 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Per-card weight selector */}
                  <div className="flex gap-1.5 mb-6">
                    {getAvailableWeights(product).map((w) => (
                      <button
                        key={w}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedWeights(prev => ({ ...prev, [product.id]: w }));
                        }}
                        className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                          (selectedWeights[product.id] || (getAvailableWeights(product)[0] || '250g')) === w 
                            ? 'bg-[#213C51] text-white border-[#213C51] shadow-md shadow-[#213C51]/20' 
                            : 'bg-gray-50 text-[#213C51] border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 md:pt-6 border-t border-gray-50">
                    <div className="flex flex-col leading-none">
                      <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Price</span>
                      <div className="flex items-center space-x-2">
                        {product.discount_percentage > 0 ? (
                          <>
                            <span className="text-base md:text-xl font-black text-orange-600 tracking-tighter italic">₹{getWeightPrice(product)}</span>
                            <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">₹{getOriginalWeightPrice(product)}</span>
                          </>
                        ) : (
                          <span className="text-base md:text-xl font-black text-[#213C51] tracking-tighter italic">₹{getWeightPrice(product)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/products/${product.id}`)}
                        className={`bg-gray-50 group-hover:bg-[#213C51]/10 text-[#213C51] group-hover:text-[#213C51] px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all duration-300 flex items-center ${!product.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="View Details & Add"
                      >
                        <ChevronRight size={14} />
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/products/${product.id}`)}
                        className={`bg-[#213C51]/5 text-[#213C51] px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] border border-[#213C51]/20 hover:bg-[#213C51] hover:text-white transition-all duration-300 ${!product.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <LoginPromptModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Products;
