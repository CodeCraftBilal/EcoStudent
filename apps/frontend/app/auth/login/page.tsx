"use client";

import { useState } from "react";
import { Eye, EyeOff, Leaf, BookOpen, User, Lock, Smartphone, Frown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import Lottie from "lottie-react";
import LoadingAnim from '@/public/lotieAnim/Loading.json'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [isSubmiting, setIsSubmiting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);
    return new Promise((resolve, reject) => { 
      setTimeout(() => {
        resolve(1);
        setIsSubmiting(false);
        redirect('/dashboard')
      }, 3000);
     })
    console.log("Login attempt:", formData);
    // Handle login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
                Welcome Back to Our Learning Community
              </h1>
              <p className="text-green-100 text-lg leading-relaxed">
                Join thousands of students saving money and protecting the planet by exchanging educational resources.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-green-200" />
                <span className="text-green-100">Buy & Sell Books</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-green-200" />
                <span className="text-green-100">Connect with Local Students</span>
              </div>
              <div className="flex items-center space-x-3">
                <Leaf className="w-5 h-5 text-green-200" />
                <span className="text-green-100">Sustainable Education</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">EcoStudent</span>
            </div>

            {/* Form Header */}
            <div className="text-center mb-5">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              {/* <p className="text-gray-600">Sign in to your account to continue</p> */}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
                {/* <Link href="/auth/forgot-password" className="text-sm block text-end text-green-600 hover:text-green-700 font-medium">
                    Forgot Password?
                  </Link> */}

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmiting}
                className="w-full bg-green-500 flex items-center justify-center text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isSubmiting ? <Lottie
                        className={`w-8 h-8`} 
                        animationData={LoadingAnim}
                        loop={true}
                        autoPlay={true}
                        /> : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <img className="w-6 h-6" src="/login/google.svg" alt="Login with google" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <Smartphone className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Phone</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                    Sign up now
                  </Link>
                </p>
              </div>
            </form>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-green-600 font-bold">10K+</div>
                  <div className="text-gray-600 text-sm">Students</div>
                </div>
                <div>
                  <div className="text-green-600 font-bold">25K+</div>
                  <div className="text-gray-600 text-sm">Items</div>
                </div>
                <div>
                  <div className="text-green-600 font-bold">50+</div>
                  <div className="text-gray-600 text-sm">Schools</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}