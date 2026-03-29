import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [prevUser, setPrevUser] = useState(user);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('sd_foods_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      return [];
    }
  });

  // Clear wishlist on logout
  useEffect(() => {
    if (prevUser && !user) {
      setWishlist([]);
      localStorage.removeItem('sd_foods_wishlist');
    }
    setPrevUser(user);
  }, [user, prevUser]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sd_foods_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        // Remove from wishlist
        return prev.filter(item => item.id !== product.id);
      } else {
        // Add to wishlist (minimal data needed)
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          price_250g: product.price_250g,
          image_url: product.image_url,
          category: product.category,
          food_type: product.food_type,
          is_available: product.is_available
        }];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('sd_foods_wishlist');
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
