import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import UserService from '../services/UserService';
import { FiCheckCircle, FiPhoneCall, FiMapPin, FiGift, FiLock } from 'react-icons/fi';

const BuyerSignup = () => {
  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [altPhone, setAltPhone] = useState('');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');

  // Shipping Address Collection
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country] = useState('India');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');


  // Account Preferences
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  // Pincode auto-fill helper
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      if (val.startsWith('400')) { setCity('Mumbai'); setState('Maharashtra'); }
      else if (val.startsWith('411')) { setCity('Pune'); setState('Maharashtra'); }
      else if (val.startsWith('422')) { setCity('Nashik'); setState('Maharashtra'); }
      else if (val.startsWith('423')) { setCity('Yeola'); setState('Maharashtra'); }
      else if (val.startsWith('110')) { setCity('New Delhi'); setState('Delhi'); }
      else if (val.startsWith('560')) { setCity('Bengaluru'); setState('Karnataka'); }
      else if (val.startsWith('600')) { setCity('Chennai'); setState('Tamil Nadu'); }
      else if (val.startsWith('700')) { setCity('Kolkata'); setState('West Bengal'); }
      else if (val.startsWith('500')) { setCity('Hyderabad'); setState('Telangana'); }
      else if (val.startsWith('380')) { setCity('Ahmedabad'); setState('Gujarat'); }
      else {
        setCity('City');
        setState('State');
      }
    }
  };

  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number with +91 code.');
      return;
    }
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtpError('');
    alert(`[INDRANI PAITHANI OTP] Your verification code is: ${mockOtp}`);
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

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const primaryAddressStr = `${street}, ${landmark ? landmark + ', ' : ''}${city}, ${state} - ${pincode}`;

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      email,
      password,
      phone,
      altPhone,
      mobileVerified: true,
      emailVerified: true,
      gender,
      dob,
      anniversaryDate,
      marketingOptIn,
      avatarUrl: '/assets/official_logo.jpg',
      address: primaryAddressStr,
      deliveryInstructions,
      addresses: [
        {
          id: 'addr_' + Date.now(),
          label: 'Home',
          street,
          landmark,
          pincode,
          city,
          state,
          country,
          deliveryInstructions,
          isDefault: true
        }
      ],

      connectedAuth: ['Email / Password']
    };

    users.push(newUser);
    localStorage.setItem('buyer_users', JSON.stringify(users));

    // Log user in
    useAuthStore.getState().setAuth({
      uid: 'user_' + Date.now(),
      ...newUser
    }, 'buyer');

    await UserService.updateCurrentUser(newUser);

    alert('🎉 Account created successfully! Welcome to the Indrani Paithani Royal Family.');
    navigate('/buyer-dashboard');
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4 py-12 text-black">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl w-full border border-gold/20 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-16 w-auto mx-auto object-contain rounded-full shadow-sm" />
          <h1 className="text-3xl font-heading text-maroon font-bold tracking-wide">Create Buyer Account</h1>
          <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
            Register to explore handwoven Yeola Paithani sarees, track orders, and receive exclusive patron benefits.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          
          {/* SECTION 1: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-maroon uppercase tracking-wider border-b border-gold/20 pb-2 flex items-center space-x-2">
              <span>1. Personal Information</span>
            </h3>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                  placeholder="e.g. Aditi"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                  placeholder="e.g. Deshmukh"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                placeholder="name@domain.com"
              />
            </div>

            {/* Mobile Phone (+91 & OTP Verification) */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
              <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center justify-between">
                <span>Mobile Number (OTP Verification) *</span>
                {mobileVerified && <span className="text-green-700 text-[10px] font-bold">✓ OTP Verified</span>}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  disabled={mobileVerified}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-grow px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs disabled:bg-gray-100 font-medium"
                  placeholder="+91 9876543210"
                />
                {!mobileVerified ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-maroon hover:bg-gold text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs whitespace-nowrap"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                ) : (
                  <span className="bg-green-100 text-green-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1 shrink-0">
                    <FiCheckCircle />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {otpSent && !mobileVerified && (
                <div className="flex gap-2 pt-2 border-t border-purple-100">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
              {generatedOtp && !mobileVerified && (
                <p className="text-[11px] text-purple-800 bg-white p-2 rounded-xl border border-purple-200">
                  💡 Demo Verification Code: <span className="font-bold font-mono text-black">{generatedOtp}</span>
                </p>
              )}
            </div>

            {/* Alternate Phone & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Alternate Phone (Optional)</label>
                <input
                  type="text"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                  placeholder="+91 Mobile or Landline"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Gender / Pronoun (Optional)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary / Other">Non-binary / Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* DOB & Anniversary Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream/20 p-3 rounded-2xl border border-gold/10">
              <div>
                <label className="block text-[11px] font-bold text-maroon uppercase mb-1 flex items-center space-x-1">
                  <FiGift className="text-gold" />
                  <span>Date of Birth (Offers)</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-maroon uppercase mb-1 flex items-center space-x-1">
                  <FiGift className="text-gold" />
                  <span>Anniversary Date (Offers)</span>
                </label>
                <input
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Initial Shipping Address */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-maroon uppercase tracking-wider border-b border-gold/20 pb-2 flex items-center space-x-2">
              <FiMapPin className="text-gold" />
              <span>2. Primary Shipping Address</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Flat / Building / Street Address *</label>
              <textarea
                rows={2}
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                placeholder="e.g. Flat 402, Royal Palms Apartment, MG Road"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                  placeholder="e.g. Opp Central Library"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={pincode}
                  onChange={handlePincodeChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs font-semibold"
                  placeholder="6-digit (e.g. 400001)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">City & State</label>
                <input
                  type="text"
                  readOnly
                  value={city && state ? `${city}, ${state}` : ''}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium text-gray-700"
                  placeholder="Auto-filled on pincode"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Special Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                placeholder="e.g. Call before delivery / Leave at gate with security"
              />
            </div>
          </div>


          {/* SECTION 3: Security & Preferences */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-maroon uppercase tracking-wider border-b border-gold/20 pb-2 flex items-center space-x-2">
              <FiLock className="text-gold" />
              <span>3. Account Security & Preferences</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-center space-x-3 cursor-pointer bg-cream/30 p-3 rounded-xl border border-gold/15">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="rounded border-gray-300 text-maroon focus:ring-gold accent-maroon w-4 h-4"
              />
              <span className="text-xs text-gray-700 font-medium">
                Subscribe to Email & WhatsApp updates for exclusive heritage Paithani saree launches & festive offers.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-maroon hover:bg-gold text-white font-bold py-4 rounded-full transition shadow-lg text-xs uppercase tracking-widest mt-6"
          >
            Create Verified Account
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          Already have an account?{' '}
          <Link to="/buyer-login" className="text-maroon font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignup;
