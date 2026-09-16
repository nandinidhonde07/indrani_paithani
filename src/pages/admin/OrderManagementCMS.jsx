import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService.js';
import { generateInvoice } from '../../utils/InvoiceGenerator.js';
import { FiX } from 'react-icons/fi';

const OrderManagementCMS = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  const loadOrders = async () => {
    const fetchedOrders = await OrderService.getAllOrders();
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('indrani_order_created', loadOrders);
    window.addEventListener('storage', loadOrders);
    return () => {
      window.removeEventListener('indrani_order_created', loadOrders);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await OrderService.updateOrderStatus(orderId, newStatus);
    loadOrders();
    if (selectedOrder && selectedOrder.orderId === orderId) {
      const updatedOrder = await OrderService.getAllOrders().then(res => res.find(o => o.orderId === orderId));
      setSelectedOrder(updatedOrder);
    }
  };

  const handleAssignTracking = async (e) => {
    e.preventDefault();
    if (trackingNumber && courierName) {
      await OrderService.assignTracking(selectedOrder.orderId, courierName, trackingNumber);
      setTrackingNumber('');
      setCourierName('');
      loadOrders();
      const updatedOrder = await OrderService.getAllOrders().then(res => res.find(o => o.orderId === selectedOrder.orderId));
      setSelectedOrder(updatedOrder);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-800 border border-green-200';
    if (status === 'Shipped' || status === 'Out For Delivery') return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (status === 'Cancelled') return 'bg-red-100 text-red-800 border border-red-200';
    if (status === 'Preparing Your Paithani' || status === 'Quality Inspection') return 'bg-purple-100 text-purple-800 border border-purple-200';
    return 'bg-gold/20 text-maroon border border-gold/30'; // Confirmed, Packed, etc.
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-8 animate-fade-in">
      <div className="border-b border-gold/20 pb-4">
        <h2 className="text-3xl font-heading text-maroon font-bold">Order Management CMS</h2>
        <p className="text-xs text-gray-500 font-light mt-1">Track customer orders, manage status pipeline, and generate PDF invoices.</p>
      </div>
      
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gold/20 text-maroon font-heading font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Total Price</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">No customer orders received yet.</td>
              </tr>
            ) : orders.map(ord => (
              <tr key={ord.orderId} className="border-b border-gold/10 last:border-0 hover:bg-cream/20 transition">
                <td className="py-3.5 px-3 font-bold text-maroon font-mono">{ord.orderId}</td>
                <td className="py-3.5 px-3 text-gray-500">{new Date(ord.orderDate).toLocaleDateString()}</td>
                <td className="py-3.5 px-3 font-semibold text-black">{ord.buyerName}</td>
                <td className="py-3.5 px-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                    {ord.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-bold text-black text-sm">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(ord)}
                    className="text-xs bg-gold hover:bg-maroon hover:text-white text-maroon font-bold py-1.5 px-4 rounded-full transition shadow-xs"
                  >
                    Manage
                  </button>
                  <button 
                    onClick={() => generateInvoice(ord)}
                    className="text-xs border border-maroon hover:bg-maroon hover:text-white text-maroon font-bold py-1.5 px-4 rounded-full transition"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-maroon p-6 text-white relative flex justify-between items-center">
              <div>
                <h3 className="font-heading text-2xl tracking-wide text-gold">Manage Order</h3>
                <p className="text-sm opacity-90">{selectedOrder.orderId} | {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/70 hover:text-white transition font-bold p-1 rounded-full hover:bg-white/10" aria-label="Close Modal">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-hidden">
              
              {/* Left Column: Details */}
              <div className="p-8 overflow-y-auto bg-gray-50 border-r border-gray-100 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Customer Info</h4>
                  <p className="font-semibold text-black">{selectedOrder.buyerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.buyerEmail}</p>
                  <p className="text-sm text-gray-600">Primary Ph: {selectedOrder.phone}</p>
                  {selectedOrder.altPhone && <p className="text-xs text-gray-500">Alt Ph: {selectedOrder.altPhone}</p>}
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Shipping Address & Delivery Instructions</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border">{selectedOrder.shippingAddress}</p>
                  {selectedOrder.deliveryInstructions && (
                    <div className="bg-cream/40 p-2.5 rounded-lg border border-gold/20 mt-2 text-xs">
                      <span className="font-bold text-maroon block text-[10px] uppercase">Special Delivery Notes:</span>
                      <span className="text-gray-700 italic">{selectedOrder.deliveryInstructions}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Payment Info</h4>
                  <p className="text-sm"><span className="font-semibold">Method:</span> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.razorpayPaymentId && (
                     <p className="text-sm"><span className="font-semibold">Txn ID:</span> <span className="font-mono text-xs">{selectedOrder.razorpayPaymentId}</span></p>
                  )}
                  <p className="text-xl font-bold text-maroon mt-2">Grand Total: ₹{selectedOrder.grandTotal.toLocaleString('en-IN')}</p>
                </div>
                
                <div>
                   <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Items</h4>
                   <div className="space-y-2">
                     {selectedOrder.items.map(item => (
                       <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                         <span>{item.name} <span className="text-gray-400">(x{item.quantity})</span></span>
                         <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Right Column: Actions & Timeline */}
              <div className="p-8 overflow-y-auto bg-white space-y-8">
                
                {/* Status Updater */}
                <div>
                  <h4 className="font-heading text-lg text-maroon mb-4 border-b pb-2">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Order Confirmed", "Preparing Your Paithani", "Quality Inspection", "Packed", "Out For Delivery", "Delivered", "Cancelled"].map(status => (
                      <button 
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.orderId, status)}
                        disabled={selectedOrder.status === status || selectedOrder.status === 'Cancelled'}
                        className={`text-xs font-semibold py-2 px-3 rounded border transition ${
                          selectedOrder.status === status ? 'bg-maroon text-white border-maroon' : 'hover:bg-cream border-gray-200 text-gray-700'
                        } disabled:opacity-50`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispatch / Courier */}
                <div className="bg-cream/30 p-4 rounded-xl border border-gold/20">
                  <h4 className="font-heading text-md text-maroon mb-3">Assign Dispatch (Shipping)</h4>
                  {selectedOrder.trackingNumber ? (
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-semibold text-gray-600">Courier:</span> {selectedOrder.courier}</p>
                      <p className="text-sm"><span className="font-semibold text-gray-600">Tracking:</span> {selectedOrder.trackingNumber}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleAssignTracking} className="space-y-3">
                      <input 
                        type="text" required placeholder="Courier Name (e.g. BlueDart)" 
                        value={courierName} onChange={e => setCourierName(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold outline-none"
                      />
                      <input 
                        type="text" required placeholder="Tracking Number" 
                        value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border rounded focus:ring-1 focus:ring-gold outline-none"
                      />
                      <button type="submit" disabled={selectedOrder.status === 'Cancelled'} className="w-full bg-gold hover:bg-maroon hover:text-white text-maroon text-xs font-bold py-2 rounded transition disabled:opacity-50">
                        Mark as Shipped & Notify Buyer
                      </button>
                    </form>
                  )}
                </div>

                {/* Timeline Log */}
                <div>
                   <h4 className="font-heading text-lg text-maroon mb-3 border-b pb-2">Activity Log</h4>
                   <div className="space-y-3">
                     {[...(selectedOrder.timeline || [])].reverse().map((t, idx) => (
                       <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-100 flex justify-between items-start">
                         <div>
                           <span className="font-bold text-gray-700 block">{t.status}</span>
                           <span className="text-gray-500 mt-1 block">{t.message}</span>
                         </div>
                         <span className="text-[9px] text-gray-400 whitespace-nowrap">{new Date(t.date).toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagementCMS;
