import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Phone, Truck, CheckCircle } from 'lucide-react';

const DeliveryDashboard = () => {
    const { user } = useContext(AuthContext);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user || user.role !== 'delivery_partner') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await api.get('/orders'); // Get all orders (delivery partner should probably have a specific endpoint, but for now we'll use this)
                const localOrders = res.data.filter(o => o.delivery_method === 'local' && o.order_status !== 'delivered');
                setDeliveries(localOrders);
            } catch (error) {
                console.error("Failed to fetch deliveries");
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put('/delivery/status', { orderId, status: newStatus });
            setDeliveries(deliveries.map(d => d.order_id === orderId ? { ...d, status: newStatus } : d));
        } catch (error) {
            console.error("Failed to update status");
            // Optimistic update for mock
            setDeliveries(deliveries.map(d => d.order_id === orderId ? { ...d, status: newStatus } : d));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Delivery Portal</h1>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : deliveries.length === 0 ? (
                <div className="text-center py-20 bg-[#E8E2D8]/30 backdrop-blur-sm rounded-3xl border border-dashed border-[#213C51]/20">
                    <Truck size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No active deliveries</h3>
                    <p className="mt-1 text-gray-500">You're all caught up for now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deliveries.filter(d => d.status !== 'delivered').map((delivery) => (
                        <div key={delivery.id} className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 p-6 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4 border-b border-[#213C51]/10 pb-4">
                                <div>
                                    <span className="text-xs font-bold text-[#213C51] bg-[#E8E2D8]/60 px-3 py-1.5 rounded-lg border border-white/20">Order #{delivery.id}</span>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase ${
                                    delivery.order_status === 'processing' ? 'bg-blue-500/20 text-[#213C51] border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-800 border border-yellow-500/30'
                                }`}>
                                    {delivery.order_status}
                                </span>
                            </div>

                            <div className="space-y-4 flex-grow mb-6">
                                <div className="flex items-start bg-[#E8E2D8]/20 p-3 rounded-xl border border-white/20">
                                    <div>
                                        <p className="text-xs font-bold text-[#213C51]/60 uppercase tracking-wide">Customer Info</p>
                                        <div className="text-sm font-bold text-gray-900 mt-1">
                                            {delivery.shipping_address?.firstName} {delivery.shipping_address?.lastName}
                                        </div>
                                        <div className="flex space-x-2 mt-1">
                                            <a href={`tel:${delivery.shipping_address?.phone}`} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 transition-colors hover:bg-blue-100">
                                                Call: {delivery.shipping_address?.phone}
                                            </a>
                                            {delivery.shipping_address?.altPhone && (
                                                <a href={`tel:${delivery.shipping_address?.altPhone}`} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100 transition-colors hover:bg-green-100">
                                                    Alt: {delivery.shipping_address?.altPhone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start bg-[#E8E2D8]/20 p-3 rounded-xl border border-white/20">
                                    <MapPin size={20} className="text-[#213C51] mr-3 mt-0.5 w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-[#213C51]/60 uppercase tracking-wide">Delivery Address</p>
                                        <div className="text-sm font-medium text-gray-900 mt-1">
                                            {delivery.shipping_address ? (
                                                <>
                                                    <div>{delivery.shipping_address.addressLine1}</div>
                                                    {delivery.shipping_address.addressLine2 && <div>{delivery.shipping_address.addressLine2}</div>}
                                                    {delivery.shipping_address.landmark && <div className="text-xs italic text-[#213C51]/60 mt-1">Landmark: {delivery.shipping_address.landmark}</div>}
                                                    {delivery.shipping_address.village && <div>{delivery.shipping_address.village}</div>}
                                                    <div>{delivery.shipping_address.city}, {delivery.shipping_address.state} - {delivery.shipping_address.pincode}</div>
                                                </>
                                            ) : (
                                                <span className="italic opacity-50">No address provided</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                {delivery.status === 'assigned' && (
                                    <button 
                                        onClick={() => updateStatus(delivery.order_id, 'picked_up')}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all text-sm"
                                    >
                                        Mark as Picked Up
                                    </button>
                                )}
                                {delivery.status === 'picked_up' && (
                                    <button 
                                        onClick={() => updateStatus(delivery.order_id, 'delivered')}
                                        className="w-full py-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all text-sm"
                                    >
                                        <CheckCircle size={20} className="mr-2" />
                                        Confirm Delivery
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboard;
