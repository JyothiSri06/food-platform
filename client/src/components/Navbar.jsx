import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const { wishlistCount, clearWishlist } = useContext(WishlistContext);
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  let menuTimeout = null;

  const handleMouseEnter = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setShowUserMenu(true);
  };

  const handleMouseLeave = () => {
    menuTimeout = setTimeout(() => {
      setShowUserMenu(false);
    }, 300); // 300ms delay to bridge any gaps
  };

  const handleLogout = () => {
    console.log("Navbar: Initiating logout and clearing state...");
    // Clear cart/wishlist first to ensure UI updates before session is destroyed
    if (clearCart) clearCart();
    if (clearWishlist) clearWishlist();
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-[#213C51] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <div className="bg-[#E8E2D8] rounded-full shadow-md overflow-hidden flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16">
                 <img src={settings.logo_url || "/logo.png"} alt={`${settings.business_name || "Jeji Vantalu"} Logo`} className="h-full w-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-base sm:text-xl md:text-2xl lg:text-4xl text-[#E8E2D8] drop-shadow-lg font-courier font-bold italic tracking-tighter whitespace-nowrap">{settings.business_name || 'Jeji Vantalu'}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-orange-100 hover:text-white font-medium transition duration-150">Home</Link>
            <Link to="/products" className="text-orange-100 hover:text-white font-medium transition duration-150">Menu</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {(user.role?.toLowerCase().trim() === 'admin') && (
                  <Link to="/admin" className="text-orange-100 hover:text-white font-medium tracking-wide">Dashboard</Link>
                )}
                {user.role === 'delivery_partner' && (
                  <Link to="/delivery" className="text-orange-100 hover:text-white font-medium tracking-wide">Deliveries</Link>
                )}
                <div 
                  className="relative py-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center text-[#E8E2D8] hover:text-white font-medium space-x-1 outline-none">
                    <User size={20} />
                    <span>{user.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 w-48 top-full pt-2 z-50">
                      <div className="py-2 bg-[#E8E2D8] border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
                        {(user.role?.toLowerCase().trim() === 'admin') && (
                          <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-[#213C51] hover:bg-orange-50 font-bold border-b border-gray-200">Admin Dashboard</Link>
                        )}
                        <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-[#213C51] hover:bg-orange-100 font-medium transition-colors">My Orders</Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }} 
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-orange-100 hover:text-white font-medium transition duration-150">Login</Link>
                <Link to="/register" className="bg-[#E8E2D8] text-[#213C51] px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition duration-150 shadow-md">Sign Up</Link>
              </div>
            )}

            <Link to="/wishlist" className="relative p-2 text-white hover:text-orange-200 transition duration-150">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#213C51] transform translate-x-1/4 -translate-y-1/4 bg-[#E8E2D8] rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-white hover:text-orange-200 transition duration-150">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#213C51] transform translate-x-1/4 -translate-y-1/4 bg-[#E8E2D8] rounded-full shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <Link to="/wishlist" className="relative p-2 text-white hover:text-orange-200">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#213C51] transform translate-x-1/4 -translate-y-1/4 bg-[#E8E2D8] rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 mr-4 text-white hover:text-orange-200">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#213C51] transform translate-x-1/4 -translate-y-1/4 bg-[#E8E2D8] rounded-full shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-orange-200 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#213C51] shadow-xl border-t border-[#E8E2D8]/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Menu</Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Wishlist</Link>
            
            {user ? (
              <>
                {(user.role?.toLowerCase().trim() === 'admin') && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Dashboard</Link>
                )}
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#E8E2D8] hover:text-white hover:bg-[#E8E2D8]/10 rounded-md">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[#213C51] bg-[#E8E2D8] mt-2 rounded-md">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
