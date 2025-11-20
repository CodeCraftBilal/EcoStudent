"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Leaf,
  BookOpen,
  User,
  Lock,
  Mail,
  MapPin,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "@/context/useSession";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/types/constants";
import { SubmitHandler, useForm } from "react-hook-form";


type FormData = {
  userName: string,
    email: string,
    phoneNumber: number | null,
    userLocation: string | null,
    password: string,
    confirmPassword: string,
    userType: string,
    agreeToTerms: boolean,
}
type ServerMessage = {
  success: boolean;
  error: boolean;
  message: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    email: "",
    phoneNumber: 0,
    userLocation: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    agreeToTerms: false,
  });

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<FormData>()

  //   const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)

  // checking session
  const { session, setSession, isLoading } = useSession();
  useEffect(() => {
    const checkSession = async () => {
      if (session && session.email) {
        console.log(session);
        redirect("/dashboard");
      }
    };

    checkSession();
  }, [isLoading]);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Signup attempt:", formData);

    const { phoneNumber, userLocation, ...rest } = formData;
    const newPhoneNumber = () => { 
      if(phoneNumber && phoneNumber == 0) {
        return null;
      }
      return phoneNumber;
    }
    const newUserLocation = () => { 
      if(userLocation && userLocation.trim() == '') {
        return null;
      }
      return userLocation;
    }
    // Handle signup logic here
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( {
        ...rest,
        newUserLocation,
        newPhoneNumber
      }),
    });
    const result = await res.json();
    if(!res.ok) {
      console.log('full error: ', result)
    }
    console.log(result);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-200";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand & Information */}
        <div className="bg-gradient-to-br from-green-500 to-blue-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <Leaf className="w-8 h-8" />
              <span className="text-2xl font-bold">EcoStudent</span>
            </div>

            {/* Welcome Message */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Join Our Sustainable Student Community
              </h1>
              <p className="text-green-100 text-lg leading-relaxed">
                Start saving money, making friends, and protecting the
                environment by exchanging educational resources with students
                near you.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-green-200" />
                <span className="text-green-100">
                  Buy & sell textbooks at affordable prices
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-green-200" />
                <span className="text-green-100">
                  Connect with students in your area
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Leaf className="w-5 h-5 text-green-200" />
                <span className="text-green-100">
                  Reduce waste and help the planet
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-200" />
                <span className="text-green-100">
                  Safe, local meetups on campus
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-eco-400"
          >
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-green-200 text-sm">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">₹2M+</div>
              <div className="text-green-200 text-sm">Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-green-200 text-sm">Schools</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6 lg:hidden">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                EcoStudent
              </span>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-sm">
                Join thousands of students saving money and the planet
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="fullName"
                    name="userName"
                    required
                    value={formData.userName ?? ""}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      id="phone"
                      name="phoneNumber"
                      value={formData.phoneNumber ?? ""}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="location"
                      name="userLocation"
                      value={formData.userLocation ?? ""}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* User Type */}
              <div>
                <label
                  htmlFor="userType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I am a *
                </label>
                <select
                  id="userType"
                  name="userType"
                  required
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="alumni">Alumni</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password ?? ""}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength === 4
                            ? "text-green-600"
                            : passwordStrength === 3
                              ? "text-blue-600"
                              : passwordStrength === 2
                                ? "text-yellow-600"
                                : passwordStrength === 1
                                  ? "text-red-600"
                                  : "text-gray-600"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword ?? ""}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-all"
                  />
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-eco-500 border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={
                  !formData.agreeToTerms ||
                  formData.password !== formData.confirmPassword
                }
                className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-eco-500 focus:ring-offset-2"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">
                  or sign up with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <Smartphone className="w-4 h-4 text-gray-700" />
                  <span className="font-medium text-gray-700">Phone</span>
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            {/* Mobile Stats */}
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-green-600 font-bold text-sm">10K+</div>
                  <div className="text-gray-600 text-xs">Students</div>
                </div>
                <div>
                  <div className="text-green-600 font-bold text-sm">₹2M+</div>
                  <div className="text-gray-600 text-xs">Saved</div>
                </div>
                <div>
                  <div className="text-green-600 font-bold text-sm">50+</div>
                  <div className="text-gray-600 text-xs">Schools</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
