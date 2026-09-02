import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import useAuthStore from '../store/useAuthStore';

const OwnerLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'owner') navigate('/admin');
      else navigate('/buyer-dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const result = await AuthService.loginOwner();
    setIsLoading(false);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-[#111111] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium max-w-md w-full border border-gold/10 space-y-6 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-maroon via-gold to-maroon"></div>

        <div className="text-center">
          <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-heading text-maroon">Owner Portal</h1>
          <p className="text-sm text-gray-500 font-light mt-2">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="pt-4 pb-2">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-full transition shadow-sm flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>{isLoading ? 'Verifying Identity...' : 'Continue with Google'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default OwnerLogin;
