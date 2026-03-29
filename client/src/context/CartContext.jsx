import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [prevUser, setPrevUser] = useState(user);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  // Clear cart on logout
  useEffect(() => {
    if (prevUser && !user) {
      setCart([]);
      localStorage.removeItem('cart');
    }
    setPrevUser(user);
  }, [user, prevUser]);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product, weight = '250g', price = null) => {
    const itemPrice = price || product.price;
    const cartId = `${product.id}-${weight}`;
    
    setCart((prev) => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { 
        cartId,
        product_id: product.id, 
        name: product.name, 
        price: itemPrice, 
        weight: weight,
        quantity: 1, 
        image_url: product.image_url,
        product_type: product.product_type,
        customization_ids: product.customization_ids || []
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter(item => item.cartId !== cartId));
  };
  
  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return removeFromCart(cartId);
    setCart((prev) => 
      prev.map(item => 
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal }}>
      {children}
    </CartContext.Provider>
  );
};
