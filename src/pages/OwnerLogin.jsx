import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'owner@indranipaithani.com' && password === 'owner123') {
      localStorage.setItem('role', 'owner');
      navigate('/admin');
    } else {
      alert('Unauthorized access. Owner login details are protected.');
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium max-w-md w-full border border-gold/10 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-heading text-maroon">Owner Portal</h1>
          <p className="text-sm text-gray-500 font-light mt-2">Enter your admin credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="owner@indranipaithani.com"
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
            Access Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Demo Credentials: owner@indranipaithani.com / owner123
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
