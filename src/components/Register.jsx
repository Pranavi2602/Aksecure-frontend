import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Shield, User, Mail, Lock, Building2, Phone, MapPin, CheckCircle2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: ""
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.address.trim()) {
      errors.address = "Company address is required";
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const { isValid, errors } = validateForm();
    if (!isValid) {
      // Scroll to first error field after state update
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
          const errorField = document.getElementById(firstErrorKey);
          if (errorField) {
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorField.focus();
          }
        }
      }, 100);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      
      // Map server errors to specific fields for visual feedback
      const serverFieldErrors = {};
      const lowerMessage = errorMessage.toLowerCase();
      
      if (lowerMessage.includes("email") && (lowerMessage.includes("exists") || lowerMessage.includes("already"))) {
        serverFieldErrors.email = errorMessage;
      }
      if (lowerMessage.includes("phone") && (lowerMessage.includes("exists") || lowerMessage.includes("already"))) {
        serverFieldErrors.phone = errorMessage;
      }
      if (lowerMessage.includes("required fields")) {
        // Check which fields are missing
        if (!formData.name.trim()) serverFieldErrors.name = "Name is required";
        if (!formData.companyName.trim()) serverFieldErrors.companyName = "Company name is required";
        if (!formData.phone.trim()) serverFieldErrors.phone = "Phone number is required";
        if (!formData.email.trim()) serverFieldErrors.email = "Email is required";
        if (!formData.password) serverFieldErrors.password = "Password is required";
        if (!formData.address.trim()) serverFieldErrors.address = "Company address is required";
      }
      
      if (Object.keys(serverFieldErrors).length > 0) {
        setFieldErrors(serverFieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-lime-500";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-500 to-slate-100">
      
      {/* LEFT SIDE - BRANDING (narrower so form gets more vertical space) */}
      <div className="hidden lg:flex lg:w-3/6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-8 text-white">
          <div className="mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center ml-9 mb-4">
              <Shield className="w-7 h-7 text-slate-900" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 ml-8 tracking-tight">
              Join Our Platform
            </h1>
            <p className="text-base lg:text-lg text-slate-300 leading-relaxed ml-8 max-w-xs">
              Create your company account and start managing tickets efficiently.
            </p>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-start space-x-3">
              <div className="ml-8 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-base">Quick Setup</p>
                <p className="text-sm text-slate-400">Get started in less than 2 minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="ml-8 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-base">Raise Tickets</p>
                <p className="text-sm text-slate-400">Report your issues and get quick fixes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="ml-8 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-base">Enterprise Security</p>
                <p className="text-sm text-slate-400">Bank-level encryption for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTRATION FORM */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">

          {/* Registration Card - reduced padding and max-height so it fits */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-h-[calc(100vh-4rem)] overflow-auto">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Create Your Account
              </h2>
              <p className="text-slate-600 mt-1 text-xs">
                Register your company and start managing tickets
              </p>
            </div>

            {/* Server Error Alert - Only show if no field-specific errors */}
            {error && Object.keys(fieldErrors).length === 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-800 flex-1">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              
              {/* Name & Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.name ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.name 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.companyName ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.companyName 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="Acme Corp"
                    />
                  </div>
                  {fieldErrors.companyName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>
                  )}
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.phone ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.phone 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.email 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="john@company.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.password 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                                 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                  {formData.password && !fieldErrors.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg 
                                 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                                 ${fieldErrors.confirmPassword 
                                   ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                   : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                 }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                                 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-slate-700 mb-1">
                  Company Address
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-3 w-4 h-4 ${fieldErrors.address ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg 
                               outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm
                               ${fieldErrors.address 
                                 ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                 : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                               }`}
                    placeholder="123 Business St, City, Country"
                  />
                </div>
                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-medium text-white transition-all duration-200
                           shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                           bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600">
                Already have an account?{" "}
                <button 
                  onClick={handleLoginClick}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <p className="text-center text-xs text-slate-500 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
