import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getSubtotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-[#213C51] tracking-tight mb-4">Your Cart is Empty</h2>
        <p className="text-[#213C51] mb-8 max-w-lg mx-auto">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#213C51] hover:bg-[#39465D] transition shadow-lg shadow-[#213C51]/20"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-[#213C51] tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/20 overflow-hidden lg:flex p-8">
        <div className="lg:w-2/3 pr-8">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.cartId} className="py-6 flex flex-col sm:flex-row pb-6 pt-6 first:pt-0">
                <Link to={`/products/${item.product_id || item.id}`} className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden mb-4 sm:mb-0 hover:opacity-80 transition-opacity">
                  <img
                    src={item.image_url || `https://via.placeholder.com/300?text=${item.name}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 sm:ml-6 flex flex-col">
                  <div className="flex justify-between w-full">
                    <div>
                    <Link to={`/products/${item.product_id || item.id}`} className="block group">
                      <h3 className="text-lg font-bold text-[#213C51] group-hover:text-[#39465D] transition-colors">{item.name}</h3>
                    </Link>
                      <p className="mt-1 text-sm text-[#213C51]">
                        {item.weight ? `${item.weight} • ` : ''}
                        {item.product_type === 'fresh' ? 'Only in Local' : 'Packaged Delivery'}
                      </p>
                    </div>
                    <p className="text-lg font-extrabold text-[#213C51] hidden sm:block">₹{item.price}</p>
                  </div>

                  <div className="mt-4 flex-1 flex items-end justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-extrabold text-[#213C51] sm:hidden">₹{item.price * item.quantity}</p>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-[#213C51] mb-6 relative pb-4">
              Order Summary
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#213C51] rounded-full"></span>
            </h2>
            
            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-[#213C51]">₹{getSubtotal()}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-medium text-[#213C51]">Calculated at checkout</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <dt className="text-base font-bold text-[#213C51]">Total Before Shipping</dt>
                <dd className="text-lg font-extrabold text-[#213C51]">₹{getSubtotal()}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-[#213C51]/20 text-white bg-[#213C51] hover:bg-[#39465D] transition"
              >
                Proceed to Checkout <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
