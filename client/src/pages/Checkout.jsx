import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck } from 'lucide-react';
import api from '../services/api';

const Checkout = () => {
  const { cart, getSubtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const activeItems = buyNowItem ? [buyNowItem] : cart;

  const currentSubtotal = buyNowItem 
    ? (buyNowItem.price * buyNowItem.quantity) 
    : getSubtotal();

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [village, setVillage] = useState('');
  const [state, setState] = useState('Telangana');
  const [customizationNotes, setCustomizationNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState([]);
  const [fetchingVillages, setFetchingVillages] = useState(false);
  const [availableCustomizations, setAvailableCustomizations] = useState([]);
  const [perItemChoices, setPerItemChoices] = useState({});

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const res = await api.get('/customizations');
        // Defensive parsing for options which might be JSONB strings
        const processed = res.data.map(c => {
          let opts = c.options;
          if (typeof opts === 'string') {
            try { opts = JSON.parse(opts); } catch(e) { opts = []; }
          }
          return { ...c, options: opts };
        });
        setAvailableCustomizations(processed);
        
        // Initialize empty choices (making them optional)
        const initial = {};
        activeItems.forEach(item => {
          initial[item.cartId] = {};
        });
        setPerItemChoices(initial);
      } catch (err) {
        console.error("Error fetching customizations:", err);
      }
    };
    fetchCustomizations();
  }, []); // Only on mount or when items are first loaded

  useEffect(() => {
    const fetchVillages = async () => {
      if (pincode.length === 6) {
        setFetchingVillages(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffices = data[0].PostOffice || [];
            const names = [...new Set(postOffices.map(po => po.Name))].sort();
            setVillages(names);
            
            // Auto-fill City and State if they are empty or from a different pincode
            if (postOffices.length > 0) {
              const info = postOffices[0];
              if (info.District) setCity(info.District);
              if (info.State) setState(info.State);
            }

            // If the current village is not in the new list, clear it
            if (village && !names.includes(village)) {
              setVillage('');
            }
          } else {
            setVillages([]);
            setVillage('');
          }
        } catch (error) {
          console.error('Error fetching villages:', error);
          setVillages([]);
          setVillage('');
        } finally {
          setFetchingVillages(false);
        }
      } else {
        setVillages([]);
        if (pincode.length < 6) {
          setVillage('');
        }
      }
    };

    fetchVillages();
  }, [pincode]);

  const [allowedPincodes, setAllowedPincodes] = useState([]);

  useEffect(() => {
    const fetchAllowedAreas = async () => {
      try {
        const response = await api.get('/delivery-areas');
        setAllowedPincodes(response.data.map(area => area.pincode));
      } catch (error) {
        console.error('Error fetching delivery areas:', error);
      }
    };
    fetchAllowedAreas();
  }, []);

  const hasFreshItems = activeItems.some(item => item.product_type === 'fresh');
  const isLocalAddress = allowedPincodes.includes(pincode.trim());
  const isLocationInvalid = hasFreshItems && pincode.length >= 6 && !isLocalAddress;

  const deliveryFee = hasFreshItems ? 50 : 100;
  const totalAmount = currentSubtotal + deliveryFee;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!addressLine1 || !city || !pincode || !state || !landmark || !village) {
      alert('Please enter all required shipping details, including a landmark and village');
      return;
    }

    if (hasFreshItems && !isLocalAddress) {
      alert('One or more items in your cart are only available for local delivery. Please enter a supported local postal code.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        orderItems: activeItems.map(item => ({
          ...item,
          customization_choices: perItemChoices[item.cartId] || {}
        })),
        shippingAddress: { 
          firstName,
          lastName,
          email,
          phone,
          altPhone,
          addressLine1, 
          addressLine2, 
          landmark, 
          city, 
          pincode, 
          postalCode: pincode, 
          village, 
          state 
        },
        totalAmount,
        paymentMethod: 'razorpay',
        deliveryFee,
        discount: 0,
        customization_notes: customizationNotes
      };

      const orderRes = await api.post('/orders', orderPayload);
      const orderId = orderRes.data.id;

      // 1. Get Razorpay Order from backend
      const paymentRes = await api.post('/payment/create', { 
        amount: totalAmount, 
        orderId
      });
      
      if (!paymentRes.data.success) {
        throw new Error(paymentRes.data.error || 'Failed to initiate payment');
      }

      const { order_id, amount: rzpAmount, key_id, isMock } = paymentRes.data;

      // Mock Mode bypass (for Demo/Resume preview without live keys)
      if (isMock) {
        alert("Demo Mode: Payment simulated successfully!");
        await api.put(`/orders/${orderId}/pay`, { transaction_id: `mock_txn_${Date.now()}` });
        if (!buyNowItem) clearCart();
        navigate('/orders?success=true');
        return;
      }

      // 2. Load Razorpay JS Checkout Script Dynamically
      const loadScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
      }

      // 3. Invoke Razorpay Checkout Modal
      const options = {
        key: key_id,
        amount: rzpAmount,
        currency: "INR",
        name: "Jeji Vantalu",
        description: `Order #${orderId}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await api.put(`/orders/${orderId}/pay`, { transaction_id: response.razorpay_payment_id });
              if (!buyNowItem) clearCart();
              navigate('/orders?success=true');
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment.");
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#213C51",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error('CHECKOUT_ERROR:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || 'Order processing failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login?redirect=checkout');
    return null;
  }

  if (!buyNowItem && cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#213C51] tracking-tight mb-8">Checkout</h1>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handlePaymentSubmit}>
            <div className="bg-[#E8E2D8]/60 backdrop-blur-md shadow-sm border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-[#213C51]">
                <Truck className="mr-2" /> Shipping Details
              </h2>
              {hasFreshItems && (
                <div className={`p-4 rounded-xl mb-4 text-sm font-bold border transition-all ${
                  isLocationInvalid 
                    ? 'bg-[#213C51]/10 text-[#213C51] border-[#213C51]/20' 
                    : 'bg-[#E8E2D8] text-[#213C51] border-[#213C51]/10'
                }`}>
                  {isLocationInvalid ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#213C51] mr-2"></div>
                      Not available for this address. Local items require a supported postal code.
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#213C51] mr-2"></div>
                      Your order contains local-only items. Delivery is restricted to supported areas.
                    </>
                  )}
                </div>
              )}
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">First Name *</label>
                      <input 
                        type="text" required value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Last Name *</label>
                      <input 
                        type="text" required value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Email Address *</label>
                      <input 
                        type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Phone *</label>
                            <input 
                                type="tel" required value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Alt Phone</label>
                            <input 
                                type="tel" value={altPhone}
                                onChange={(e) => setAltPhone(e.target.value)}
                                className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                            />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Flat / House No / Building *</label>
                      <input 
                        type="text" required value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. 402, Sai Residency"
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Street / Colony / Road</label>
                      <input 
                        type="text" value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="e.g. Kondapur Main Road"
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Landmark *</label>
                      <input 
                        type="text" required value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near HDFC Bank"
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">State *</label>
                      <input 
                        type="text" required value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none font-bold" 
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">City / District *</label>
                      <input 
                        type="text" required value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none font-bold" 
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Village / Area *</label>
                      {fetchingVillages ? (
                        <div className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl text-sm text-gray-500 italic">
                          Fetching areas...
                        </div>
                      ) : (
                        <select 
                          required
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none appearance-none font-bold"
                          disabled={villages.length === 0}
                        >
                          <option value="">{pincode.length === 6 ? (villages.length > 0 ? 'Select Village / Area' : 'No areas found for this pincode') : 'Enter Pincode first'}</option>
                          {villages.map((v, i) => (
                            <option key={i} value={v}>{v}</option>
                          ))}
                        </select>
                      )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-1 ml-1">Pincode *</label>
                      <input 
                        type="text" required value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6 Digits"
                        maxLength="6"
                        className="w-full p-3 bg-white/50 border border-[#213C51]/10 rounded-xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none font-black text-lg" 
                      />
                    </div>
                 </div>

                 <div className="mt-6 border-t border-[#213C51]/5 pt-6 space-y-6">
                    {/* Other Instructions */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-[#213C51]/60 uppercase tracking-widest ml-1">Other Special Instructions</label>
                        <textarea 
                            value={customizationNotes}
                            onChange={(e) => setCustomizationNotes(e.target.value)}
                            placeholder="Any other specific requests?"
                            className="w-full p-4 bg-white/50 border border-[#213C51]/10 rounded-2xl focus:ring-2 focus:ring-[#213C51]/20 focus:border-[#213C51] transition-all outline-none font-medium h-24 resize-none"
                        />
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Customization Card */}
            {activeItems.some(item => {
              let ids = item.customization_ids;
              if (typeof ids === 'string') { try { ids = JSON.parse(ids); } catch(e) { ids = []; } }
              return ids && ids.length > 0;
            }) && (
              <div className="bg-[#E8E2D8]/60 backdrop-blur-md shadow-sm border border-white/20 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 flex items-center text-[#213C51]">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Product Preferences
                </h2>
                <div className="space-y-8">
                  {activeItems.map(item => {
                    let ids = item.customization_ids;
                    if (typeof ids === 'string') { try { ids = JSON.parse(ids); } catch(e) { ids = []; } }
                    const linkedItems = (ids && ids.length > 0) 
                      ? availableCustomizations.filter(c => ids.map(id => Number(id)).includes(Number(c.id)))
                      : [];

                    if (linkedItems.length === 0) return null;

                    return (
                      <div key={item.cartId} className="pb-6 last:pb-0 border-b border-[#213C51]/5 last:border-0">
                        <div className="flex items-center space-x-3 mb-4">
                          <img 
                            src={item.image_url || `https://via.placeholder.com/300?text=${item.name}`} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                          />
                          <span className="font-bold text-[#213C51]">{item.name} {item.weight ? `(${item.weight})` : ''}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-1">
                          {linkedItems.map(cust => (
                            <div key={cust.id} className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#213C51]/60 ml-1">{cust.name}</label>
                              <div className="flex flex-wrap gap-2">
                                {cust.options.map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setPerItemChoices(prev => {
                                      const current = prev[item.cartId]?.[cust.name];
                                      const newVal = current === opt ? undefined : opt;
                                      const newItemChoices = { ...(prev[item.cartId] || {}) };
                                      if (newVal === undefined) {
                                        delete newItemChoices[cust.name];
                                      } else {
                                        newItemChoices[cust.name] = opt;
                                      }
                                      return { ...prev, [item.cartId]: newItemChoices };
                                    })}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                      perItemChoices[item.cartId]?.[cust.name] === opt
                                        ? 'bg-[#213C51] text-white border-[#213C51] shadow-lg shadow-[#213C51]/20 scale-[1.02]'
                                        : 'bg-white/50 text-[#213C51]/40 border-[#213C51]/10 hover:border-[#213C51]/30'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-[#E8E2D8]/60 backdrop-blur-md shadow-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-[#213C51]">
                <CreditCard className="mr-2" /> Payment Method
              </h2>
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-[#E8E2D8] rounded-full flex items-center justify-center shadow-sm text-orange-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.26-1.05-2.32-1.84H7.9c.04 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.52-3.42z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#213C51]">Secure Online Payment</span>
                    <span className="text-xs text-[#213C51] font-medium">UPI, Cards, Netbanking via Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="bg-[#E8E2D8]/60 backdrop-blur-md p-6 rounded-2xl border border-white/20 sticky top-24">
            <h2 className="text-lg font-bold text-[#213C51] mb-6">Order Summary</h2>
            <ul className="space-y-4 mb-6">
              {activeItems.map(item => (
                <li key={item.cartId} className="flex justify-between text-sm items-center">
                  <span className="text-[#213C51] flex-1 pr-4 truncate" title={item.name}>
                    {item.quantity} x {item.name} {item.weight ? `(${item.weight})` : ''}
                  </span>
                  <span className="font-medium text-[#213C51]">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-[#213C51]">
                <span>Subtotal</span>
                <span className="font-medium text-[#213C51]">₹{currentSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#213C51]">
                <span>Delivery Fee</span>
                <span className="font-medium text-[#213C51]">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#213C51] mt-4 border-t border-gray-200 pt-4">
                <span>Total</span>
                <span className="text-[#213C51] text-2xl">₹{totalAmount}</span>
              </div>
            </div>
              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading || isLocationInvalid}
                className={`w-full py-4 px-4 rounded-xl text-[#E8E2D8] font-bold text-lg shadow-lg ${
                  loading || isLocationInvalid
                    ? 'bg-[#213C51]/40 cursor-not-allowed' 
                    : 'bg-[#213C51] hover:bg-[#39465D] shadow-[#213C51]/20'
                }`}
              >
                {loading ? 'Processing...' : isLocationInvalid ? 'Address Not Supported' : `Pay ₹${totalAmount}`}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
