import React, { useState, useEffect } from 'react';
import ContactService from '../../services/ContactService.js';
import { FiMail, FiTrash2, FiCheckCircle, FiSearch } from 'react-icons/fi';

const InquiriesCMS = () => {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    const data = await ContactService.getAllInquiries();
    setInquiries(data.reverse()); // Newest first
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    await ContactService.updateInquiryStatus(id, status);
    fetchInquiries();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      await ContactService.deleteInquiry(id);
      fetchInquiries();
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(search.toLowerCase()) || 
    inq.email.toLowerCase().includes(search.toLowerCase()) ||
    inq.message.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Inquiries...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading text-maroon">Customer Inquiries</h2>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-gold focus:outline-none"
          />
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow border border-gold/10 text-gray-500">
          No inquiries found.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.map(inq => (
            <div key={inq.id} className={`bg-white rounded-2xl p-6 shadow-sm border ${inq.status === 'unread' ? 'border-maroon/30 bg-maroon/5' : 'border-gold/10'} flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition hover:shadow-md`}>
              
              <div className="flex-grow space-y-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-lg">{inq.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    inq.status === 'unread' ? 'bg-red-100 text-red-700' : 
                    inq.status === 'read' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {inq.status}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(inq.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMail className="mr-2" />
                  <a href={`mailto:${inq.email}`} className="hover:text-maroon underline">{inq.email}</a>
                </div>
                <p className="text-gray-700 mt-2 bg-cream/30 p-3 rounded-xl border border-gray-100 text-sm italic">
                  "{inq.message}"
                </p>
              </div>

              <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                {inq.status === 'unread' && (
                  <button onClick={() => handleStatusChange(inq.id, 'read')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs px-4 py-2 rounded-lg font-semibold transition border border-blue-200">
                    Mark as Read
                  </button>
                )}
                {inq.status !== 'replied' && (
                  <button onClick={() => handleStatusChange(inq.id, 'replied')} className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 text-xs px-4 py-2 rounded-lg font-semibold transition border border-green-200 flex items-center justify-center space-x-1">
                    <FiCheckCircle /> <span>Mark Replied</span>
                  </button>
                )}
                <button onClick={() => handleDelete(inq.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs px-4 py-2 rounded-lg font-semibold transition border border-red-200 flex items-center justify-center space-x-1">
                  <FiTrash2 /> <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesCMS;
