"use client";

import { useEffect, useRef, useState } from "react";
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
import { redirect, useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { getUserLocation } from "@/lib/location";

type FormData = {
  userName: string;
  email: string;
  phoneNumber: string | null;
  userLocation: string | null;
  password: string;
  confirmPassword: string;
  userType: string;
  agreeToTerms: boolean;
};

type ServerMessage = {
  success: boolean;
  error: boolean;
  message: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(
    null,
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      phoneNumber: null,
      userLocation: null,
      userType: "student",
    },
  });

  const watchPassword = watch("password");
  // const watchConfirmPassword = watch("confirmPassword");
  // const watchAllFields = watch();

  // Check session
  const { session, isLoading } = useSession();
  useEffect(() => {
    if (!isLoading && session?.email) {
      console.log("session: ", session);
      router.push("/dashboard");
    }
  }, [session, isLoading]);

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (watchPassword) {
      calculatePasswordStrength(watchPassword);
    } else {
      setPasswordStrength(0);
    }
  }, [watchPassword]);

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

  const { refreshSession } = useSession();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setServerMessage(null);
    // Clear all previous field errors
    Object.keys(errors).forEach((fieldName) => {
      setError(fieldName as keyof FormData, {});
    });

    // gerUserLocation
    const location = await getUserLocation();

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      setServerMessage({
        success: false,
        error: true,
        message: "Passwords do not match",
      });
      return;
    }

    // Prepare data for API - convert empty strings to null
    const submitData = {
      ...data,
      phoneNumber: data.phoneNumber || null,
      userLocation: data.userLocation || null,
      latitude: location?.latitude,
      longitude: location?.longitude,
    };

    console.log("Submitting data:", submitData);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await res.json();

      console.log("result is: ", result);

      if (!res.ok) {
        console.log("Full error: ", result);
        // Handle non-array error response
        setServerMessage({
          success: false,
          error: true,
          message: result.message || "Signup failed. Please try again.",
        });
      } else {
        console.log("Signup successful:", result);
        setServerMessage({
          success: true,
          error: false,
          message: "Account created successfully! Redirecting...",
        });
        console.log("singup successfuly");
        // You might want to redirect to login or dashboard here
        await refreshSession();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Network error:", error);
      console.log("some error", error);
      setServerMessage({
        success: false,
        error: true,
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Brand & Information */}
        <div className="bg-linear-to-br from-green-500 to-blue-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-between">
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
            className="grid grid-cols-3 gap-4 pt-8 border-t border-green-400"
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

            {/* Server Message */}
            {serverMessage && (
              <div
                className={`p-3 rounded-lg mb-4 text-sm ${
                  serverMessage.success
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {serverMessage.message}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="userName"
                    {...register("userName", {
                      required: "This field is required",
                      minLength: {
                        value: 3,
                        message: "Minimum length should be 3 characters",
                      },
                      maxLength: {
                        value: 60,
                        message: "Maximum length is 60 characters",
                      },
                    })}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-sm text-red-500 pt-1">
                  {errors.userName?.message}
                </p>
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
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-sm text-red-500 pt-1">
                  {errors.email?.message}
                </p>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      {...register("phoneNumber", {
                        required: false,
                        pattern: {
                          value: /^[0-9+-\s()]*$/,
                          message: "Invalid phone number format",
                        },
                      })}
                      placeholder="03"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-sm text-red-500 pt-1">
                    {errors.phoneNumber?.message}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="userLocation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="userLocation"
                      {...register("userLocation", {
                        required: false,
                        maxLength: {
                          value: 60,
                          message: "Maximum length is 60 characters",
                        },
                      })}
                      placeholder="City"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-sm text-red-500 pt-1">
                    {errors.userLocation?.message}
                  </p>
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
                  {...register("userType", {
                    required: "Please select a user type",
                  })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="alumni">Alumni</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-sm text-red-500 pt-1">
                  {errors.userType?.message}
                </p>
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
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum length is 8 characters",
                      },
                      maxLength: {
                        value: 32,
                        message: "Maximum length is 32 characters",
                      },
                    })}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                <p className="text-sm text-red-500 pt-1">
                  {errors.password?.message}
                </p>

                {/* Password Strength */}
                {watchPassword && (
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
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watchPassword || "Passwords do not match",
                    })}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-sm text-red-500 pt-1">
                  {errors.confirmPassword?.message}
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-0.5"
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
              <p className="text-sm text-red-500 pt-1">
                {errors.agreeToTerms?.message}
              </p>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="grow border-t border-gray-300"></div>
                <span className="shrink mx-4 text-gray-500 text-sm">
                  or sign up with
                </span>
                <div className="grow border-t border-gray-300"></div>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`${BACKEND_URL}/auth/google/login`}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <img
                    className="w-6 h-6"
                    src="/login/google.svg"
                    alt="signup with google"
                  />
                  <span className="font-medium text-gray-700">Google</span>
                </a>
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
                    href="/auth/signin"
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
