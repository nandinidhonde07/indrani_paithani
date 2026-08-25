import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';
import { FcGoogle } from 'react-icons/fc';

const BuyerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('buyer_users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('Email already registered. Try logging in.');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('buyer_users', JSON.stringify(users));
    alert('Registration successful! Please login to your account.');
    navigate('/buyer-login');
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await AuthService.loginWithGoogle();
    if (result.success) {
      navigate('/buyer-dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium max-w-md w-full border border-gold/10 space-y-6">
        <div className="text-center">
          <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-heading text-maroon">Create Account</h1>
          <p className="text-sm text-gray-500 font-light mt-2">Join our luxury heritage family</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="name@domain.com"
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
            Register Account
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-widest absolute">Or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-full transition shadow-sm flex items-center justify-center space-x-3"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <div className="text-center text-xs text-gray-500 pt-4">
          Already have an account?{' '}
          <Link to="/buyer-login" className="text-maroon font-semibold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignup;
