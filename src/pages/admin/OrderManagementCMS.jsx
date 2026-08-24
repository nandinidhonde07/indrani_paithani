import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService.js';
import { generateInvoice } from '../../utils/InvoiceGenerator.js';

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
    if (status === 'Delivered') return 'bg-green-100 text-green-700';
    if (status === 'Shipped' || status === 'Out For Delivery') return 'bg-blue-100 text-blue-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700'; // Preparing, Confirmed, Quality Check, Packed
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-heading text-maroon">Order Management Dashboard</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Order ID</th>
              <th className="py-2">Date</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Status</th>
              <th className="py-2">Total Price</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">No orders received yet.</td>
              </tr>
            ) : orders.map(ord => (
              <tr key={ord.orderId} className="border-b border-gray-100 last:border-0 hover:bg-cream/20 transition">
                <td className="py-3 font-semibold text-maroon">{ord.orderId}</td>
                <td className="py-3">{new Date(ord.orderDate).toLocaleDateString()}</td>
                <td className="py-3">{ord.buyerName}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                    {ord.status}
                  </span>
                </td>
                <td className="py-3 font-medium">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(ord)}
                    className="text-xs bg-gold hover:bg-maroon hover:text-white text-maroon font-semibold py-1 px-3 rounded transition"
                  >
                    Manage
                  </button>
                  <button 
                    onClick={() => generateInvoice(ord)}
                    className="text-xs border border-maroon hover:bg-maroon hover:text-white text-maroon font-semibold py-1 px-3 rounded transition"
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
              <button onClick={() => setSelectedOrder(null)} className="text-white/70 hover:text-white transition font-bold text-xl mr-2">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-hidden">
              
              {/* Left Column: Details */}
              <div className="p-8 overflow-y-auto bg-gray-50 border-r border-gray-100 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Customer Info</h4>
                  <p className="font-semibold text-black">{selectedOrder.buyerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.buyerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border">{selectedOrder.shippingAddress}</p>
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
