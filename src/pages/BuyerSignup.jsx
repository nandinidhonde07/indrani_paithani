import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import UserService from '../services/UserService';

const BuyerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [address, setAddress] = useState('');

  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    // Generate a 6-digit mock OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtpError('');
    alert(`[IND-PAITHANI OTP] Your verification code is: ${mockOtp}`);
  };

  const handleVerifyOtp = () => {
    if (inputOtp.trim() === generatedOtp) {
      setMobileVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!mobileVerified) {
      alert('Please verify your mobile number via OTP before completing registration.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('buyer_users') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert('This email address is already registered. Please login instead.');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      phone,
      mobileVerified: true,
      age: age ? parseInt(age) : null,
      gender,
      address
    };

    users.push(newUser);
    localStorage.setItem('buyer_users', JSON.stringify(users));

    // Log the user in immediately
    useAuthStore.getState().setAuth({
      uid: 'user_' + Date.now(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      mobileVerified: true,
      age: newUser.age,
      gender: newUser.gender,
      address: newUser.address
    }, 'buyer');

    await UserService.updateCurrentUser(newUser);

    alert('🎉 Account created successfully! Welcome to Indrani Paithani.');
    navigate('/buyer-dashboard');
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium max-w-xl w-full border border-gold/10 space-y-6">
        <div className="text-center">
          <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-heading text-maroon">Create Buyer Account</h1>
          <p className="text-sm text-gray-500 font-light mt-2">Join our luxury heritage family for exclusive drapes</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                placeholder="e.g. Aditi Deshmukh"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                placeholder="name@domain.com"
              />
            </div>
          </div>

          {/* Mobile Number with OTP Verification */}
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
            <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider">
              Mobile Number (OTP Verification) *
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                required
                disabled={mobileVerified}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm disabled:bg-gray-100"
                placeholder="+91 9876543210"
              />
              {!mobileVerified ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-maroon hover:bg-gold text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              ) : (
                <span className="bg-green-100 text-green-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1">
                  <span>✓ Verified</span>
                </span>
              )}
            </div>

            {otpSent && !mobileVerified && (
              <div className="flex gap-2 pt-2 border-t border-purple-100">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
            {generatedOtp && !mobileVerified && (
              <p className="text-[11px] text-purple-700 bg-white p-2 rounded border border-purple-200">
                💡 Demo OTP: <span className="font-bold font-mono text-black">{generatedOtp}</span> (Sent to your mobile)
              </p>
            )}
          </div>

          {/* Demographics: Age & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Age (Years)</label>
              <input
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                placeholder="e.g. 28"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Primary Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Default Delivery Address *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="House/Flat No, Street, Landmark, City, State, Pincode"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3.5 rounded-full transition shadow-md text-sm tracking-wider uppercase mt-4"
          >
            Create Verified Account
          </button>
        </form>

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
