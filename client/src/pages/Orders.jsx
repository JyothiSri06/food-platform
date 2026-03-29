import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, CheckCircle, Truck, Info, Printer, X } from 'lucide-react';
import api from '../services/api';
import Invoice from '../components/Invoice';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const successParam = searchParams.get('success');
    const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(null); // stores order ID
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);

    const handleDownloadBill = async (orderId) => {
        setIsInvoiceLoading(orderId);
        try {
            const res = await api.get(`/orders/${orderId}`);
            setSelectedOrderForBill(res.data);
            // Small delay to ensure render before print
            setTimeout(() => {
                window.print();
                setIsInvoiceLoading(null);
            }, 100);
        } catch (error) {
            console.error("Failed to fetch order for bill", error);
            setIsInvoiceLoading(null);
        }
    };

    const handleViewBill = async (orderId) => {
        setIsInvoiceLoading(orderId);
        try {
            const res = await api.get(`/orders/${orderId}`);
            setSelectedOrderForBill(res.data);
            setIsBillModalOpen(true);
            setIsInvoiceLoading(null);
        } catch (error) {
            console.error("Failed to fetch order for bill", error);
            setIsInvoiceLoading(null);
        }
    };
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        
        try {
            const res = await api.put(`/orders/${orderId}/cancel`);
            setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
            alert('Order cancelled successfully');
        } catch (error) {
            console.error('Failed to cancel order', error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'bg-[#213C51]/10 text-[#213C51] border-[#213C51]/20';
            case 'food prepared': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'shipped': return 'bg-[#213C51]/20 text-[#213C51] border-[#213C51]/30';
            case 'delivered': return 'bg-[#213C51] text-[#E8E2D8]';
            case 'cancelled': return 'bg-gray-100 text-gray-400 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
            {successParam && (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-8 flex items-start border border-green-200 shadow-sm animate-pulse-once">
                    <CheckCircle className="mr-3 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Order Placed Successfully!</h3>
                        <p className="mt-1 text-sm">Thank you for your purchase. You can track your order status below.</p>
                    </div>
                </div>
            )}
            
            <h1 className="text-3xl font-extrabold text-[#213C51] tracking-tight mb-8">My Orders</h1>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213C51]"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-[#E8E2D8]/30 backdrop-blur-sm rounded-3xl border border-dashed border-[#213C51]/20">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-[#213C51]">No orders found</h3>
                    <p className="mt-1 text-[#213C51]">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-[#213C51]/10 bg-[#213C51]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-[#213C51] font-medium">Order ID: <span className="text-[#213C51] font-bold uppercase">#{order.id}</span></p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button
                                        onClick={() => handleViewBill(order.id)}
                                        disabled={isInvoiceLoading === order.id}
                                        className="no-print flex items-center space-x-2 px-4 py-1.5 bg-orange-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#213C51] shadow-sm hover:shadow-md transition-all active:scale-95 border border-orange-100 disabled:opacity-50"
                                    >
                                        <Info size={14} className="text-orange-600" />
                                        <span>{isInvoiceLoading === order.id ? 'Loading...' : 'View Bill'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDownloadBill(order.id)}
                                        disabled={isInvoiceLoading === order.id}
                                        className="no-print flex items-center space-x-2 px-4 py-1.5 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-[#213C51] shadow-sm hover:shadow-md transition-all active:scale-95 border border-[#213C51]/10 disabled:opacity-50"
                                    >
                                        <Printer size={14} />
                                        <span>Print Bill</span>
                                    </button>
                                    {['processing', 'pending'].includes(order.order_status.toLowerCase()) && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="no-print flex items-center space-x-2 px-4 py-1.5 bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 shadow-sm hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                                        >
                                            <X size={14} />
                                            <span>Cancel Order</span>
                                        </button>
                                    )}
                                    <Link
                                        to={`/track-order?id=${order.id}`}
                                        className="no-print flex items-center space-x-2 px-4 py-1.5 bg-[#213C51] rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent"
                                    >
                                        <Truck size={14} />
                                        <span>Track Order</span>
                                    </Link>
                                    <span className="text-lg font-extrabold text-[#213C51] bg-[#E8E2D8] px-4 py-1 rounded-lg border border-gray-200">
                                        ₹{order.total_amount}
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide uppercase ${getStatusColor(order.order_status)}`}>
                                        {order.order_status}
                                    </span>
                                    {order.refund_status && order.refund_status !== 'none' && (
                                        <span className={`px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide uppercase border ${
                                            order.refund_status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                            Refund: {order.refund_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 pb-6 space-y-4 shadow-inner shadow-black/5">
                                <div className="p-4 bg-white/40 rounded-xl border border-[#213C51]/10 text-sm">
                                    <h4 className="text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-2 flex items-center">
                                        <Truck size={14} className="mr-1.5" /> Shipping Address
                                    </h4>
                                    <div className="text-[#213C51] font-medium leading-relaxed">
                                        {order.shipping_address ? (
                                            <>
                                                <div className="mb-2 pb-2 border-b border-[#213C51]/5">
                                                    <div className="font-bold flex justify-between">
                                                        <span>{order.shipping_address.firstName} {order.shipping_address.lastName}</span>
                                                        <span className="text-xs opacity-60 font-normal">{order.shipping_address.email}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        {order.shipping_address.phone} {order.shipping_address.altPhone && ` | Alt: ${order.shipping_address.altPhone}`}
                                                    </div>
                                                </div>
                                                {order.shipping_address.addressLine1 && <div>{order.shipping_address.addressLine1}</div>}
                                                {order.shipping_address.addressLine2 && <div>{order.shipping_address.addressLine2}</div>}
                                                {order.shipping_address.landmark && <div className="text-xs italic text-[#213C51]/70">Landmark: {order.shipping_address.landmark}</div>}
                                                {order.shipping_address.village && <div>{order.shipping_address.village}</div>}
                                                <div>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode || order.shipping_address.postalCode}</div>
                                            </>
                                        ) : (
                                            <span className="italic opacity-50 text-xs">No address specified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pt-2">
                                    <div className="flex items-center text-xs text-gray-600 bg-[#E8E2D8]/20 px-4 py-2 rounded-xl w-full sm:w-auto border border-white/10 uppercase font-bold tracking-tight">
                                        {order.delivery_method === 'local' ? (
                                            <><Truck size={16} className="text-[#213C51] mr-3" /> Same-day Local Delivery</>
                                        ) : (
                                            <><Info size={16} className="text-[#213C51] mr-3" /> Standard Pan-India Courier</>
                                        )}
                                    </div>
                                    <div className="w-full sm:w-auto text-right">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase ${order.payment_status === 'paid' ? 'bg-green-50 text-[#213C51] border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                            Payment: {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedOrderForBill && <Invoice order={selectedOrderForBill} />}
            
            {/* Bill Modal */}
            {isBillModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
                    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <button 
                            onClick={() => setIsBillModalOpen(false)}
                            className="fixed top-8 right-8 z-[110] bg-white text-[#213C51] p-3 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
                        >
                            <X size={24} />
                        </button>
                        <div className="py-10">
                            <Invoice order={selectedOrderForBill} showInUI={true} />
                            <div className="text-center pb-10">
                                <button 
                                    onClick={() => handleDownloadBill(selectedOrderForBill.id)}
                                    className="bg-white text-[#213C51] px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl border border-[#213C51]/10 hover:shadow-2xl transition-all"
                                >
                                    Download / Print official Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
