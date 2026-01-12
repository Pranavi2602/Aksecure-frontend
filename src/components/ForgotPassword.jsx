import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MailCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // WORKAROUND: Check if user exists by attempting login with dummy password
      // Backend returns different errors for "User not found" vs "Invalid credentials"
      try {
        await api.post('/auth/login', {
          email: email,
          password: "Action_Verify_User_" + Math.random().toString(36)
        });
      } catch (loginError) {
        const errorMsg = loginError.response?.data?.message?.toLowerCase() || '';

        // If error indicates user doesn't exist, stop here and show error
        if (errorMsg.includes('user') ||
          errorMsg.includes('account') ||
          errorMsg.includes('email') ||
          errorMsg.includes('not found')) {
          setLoading(false);
          setMessage('Email address not registered');
          toast.error('Email address not registered');
          return;
        }
        // If error is about password (expected), user exists, so proceed
      }

      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
      setMessage('Password reset link has been sent to your email');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  };

  // Keep track of mounting to avoid state updates on unmount
  const mounted = useRef(true);
  useEffect(() => {
    return () => { mounted.current = false };
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-500 to-slate-100">

      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      relative overflow-hidden">

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-slate-900" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              AK SecureTech Ltd
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-md mb">
              Reset your password securely and regain access to your account.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>
              <div>
                <p className="font-medium">Secure Password Reset</p>
                <p className="text-sm text-slate-400">Encrypted reset links for your security</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
              <div>
                <p className="font-medium">Quick & Easy</p>
                <p className="text-sm text-slate-400">Reset your password in minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              </div>
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-slate-400">Secure link sent to your registered email</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 
                         hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 
                         transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isSuccess ? 'bg-emerald-100' : 'bg-blue-100'
                }`}>
                {isSuccess ?
                  <MailCheck className="w-6 h-6 text-emerald-600" /> :
                  <Mail className="w-6 h-6 text-blue-600" />
                }
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isSuccess ? "Check Your Email" : "Forgot Password"}
              </h2>
              <p className="text-slate-600 mt-1 text-sm">
                {isSuccess
                  ? "We've sent you a password reset link"
                  : "Enter your email to receive a reset link"}
              </p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {message && !isSuccess && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-red-800 flex-1">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200
                           shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                           bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <MailCheck className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <p className="text-sm text-emerald-800 font-medium mb-2">
                    Password reset link has been sent!
                  </p>
                  <p className="text-sm text-emerald-700">
                    We've sent an email to <span className="font-semibold">{email}</span> with instructions to reset your password.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                      setMessage('');
                    }}
                    className="w-full py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 
                             border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to Login
              </Link>
            </div>

          </div>

          {/* Security Notice */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
