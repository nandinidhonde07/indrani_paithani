import React, { useState, useEffect } from 'react';
import ReviewService from '../../services/ReviewService.js';
import { FiCheckCircle, FiXCircle, FiTrash2, FiStar, FiClock } from 'react-icons/fi';

const ReviewModerationCMS = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'rejected'

  const fetchReviews = async () => {
    setLoading(true);
    const data = await ReviewService.getAllReviews();
    setReviews(data.reverse()); // Newest first
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    await ReviewService.updateReviewStatus(id, status);
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      await ReviewService.deleteReview(id);
      fetchReviews();
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Reviews...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading text-maroon">Review Moderation</h2>
        
        <div className="flex space-x-2 bg-cream p-1 rounded-lg border border-gold/20">
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
                filter === status ? 'bg-maroon text-white shadow' : 'text-gray-500 hover:bg-gold/10 hover:text-maroon'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow border border-gold/10 text-gray-500">
          No {filter !== 'all' ? filter : ''} reviews found.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map(rev => (
            <div key={rev.id} className={`bg-white rounded-2xl p-6 shadow-sm border ${
              rev.status === 'pending' ? 'border-yellow-400/50 bg-yellow-50' : 
              rev.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-green-200'
            } flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition hover:shadow-md`}>
              
              <div className="flex-grow space-y-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-lg">{rev.userName}</h4>
                  <span className="text-gold text-sm flex items-center">
                    {rev.rating} <FiStar className="ml-1 fill-gold" />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    rev.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                    rev.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 flex items-center space-x-4">
                  <span className="flex items-center"><FiClock className="mr-1" /> {new Date(rev.date).toLocaleString()}</span>
                  <span>Product ID: {rev.productId}</span>
                </div>

                <p className="text-gray-700 mt-2 bg-white/50 p-3 rounded-xl border border-gray-100 text-sm italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                {rev.status !== 'approved' && (
                  <button onClick={() => handleStatusChange(rev.id, 'approved')} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs px-4 py-2 rounded-lg font-semibold transition border border-green-200 flex items-center justify-center space-x-1">
                    <FiCheckCircle /> <span>Approve</span>
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button onClick={() => handleStatusChange(rev.id, 'rejected')} className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs px-4 py-2 rounded-lg font-semibold transition border border-yellow-200 flex items-center justify-center space-x-1">
                    <FiXCircle /> <span>Reject/Hide</span>
                  </button>
                )}
                <button onClick={() => handleDelete(rev.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs px-4 py-2 rounded-lg font-semibold transition border border-red-200 flex items-center justify-center space-x-1">
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

export default ReviewModerationCMS;
