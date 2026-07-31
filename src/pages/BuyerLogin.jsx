import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BuyerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('buyer_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user || (email === 'buyer@indranipaithani.com' && password === 'buyer123')) {
      localStorage.setItem('role', 'buyer');
      localStorage.setItem('currentUser', JSON.stringify(user || { email, name: 'Guest Valued Buyer' }));
      navigate('/buyer-dashboard');
    } else {
      alert('Invalid login credentials. Sign up if you have not created an account.');
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium max-w-md w-full border border-gold/10 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-heading text-maroon">Buyer Login</h1>
          <p className="text-sm text-gray-500 font-light mt-2">Welcome back to luxury boutique</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="buyer@indranipaithani.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full transition shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-4">
          Don't have a luxury account?{' '}
          <Link to="/buyer-signup" className="text-maroon font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
